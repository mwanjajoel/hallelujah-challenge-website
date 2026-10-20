/* Hallelujah Challenge atmosphere shaders.
   Base: palette-matched WebGL sky (midnight -> gold horizon -> stars -> grain).
   Enhancement: shaders.com Godrays layer (WebGPU only), screen-blended on top. */

const VS = "attribute vec2 a;void main(){gl_Position=vec4(a,0.,1.);}";

const FS = [
  "precision highp float;",
  "uniform vec2 r;uniform float t,h,stars,rays,warm;uniform vec3 c0,c1,c2,c3;",
  "float hash(vec2 p){return fract(sin(dot(p,vec2(127.1,311.7)))*43758.5453);}",
  "float noise(vec2 p){vec2 i=floor(p),f=fract(p);f=f*f*(3.-2.*f);return mix(mix(hash(i),hash(i+vec2(1.,0.)),f.x),mix(hash(i+vec2(0.,1.)),hash(i+1.),f.x),f.y);}",
  "float fbm(vec2 p){float v=0.,a=.5;for(int i=0;i<5;i++){v+=a*noise(p);p*=2.03;a*=.5;}return v;}",
  "void main(){",
  " vec2 uv=gl_FragCoord.xy/r;float asp=r.x/r.y;vec2 p=vec2(uv.x*asp,uv.y);",
  " vec3 col=mix(c1,c0,smoothstep(0.,.95,uv.y));",
  " float n=fbm(p*1.4+vec2(t*.012,t*.004));",
  " float n2=fbm(p*2.6+vec2(-t*.008,t*.003)+n*1.3);",
  " col+=c1*.55*n2*smoothstep(.95,.15,uv.y);",
  " float d=uv.y-h;float wide=exp(-abs(uv.x-.5)*1.6);",
  " float glow=exp(-max(d,0.)*5.)*exp(-max(-d,0.)*16.);",
  " col+=c2*glow*.42*wide*warm;",
  " col+=c3*exp(-abs(d)*26.)*.38*wide*warm;",
  " vec2 q=vec2((uv.x-.5)*asp,uv.y-h);",
  " float ang=atan(q.x,max(q.y,.001));",
  " float ray=noise(vec2(ang*8.,t*.06))*noise(vec2(ang*21.+3.,-t*.04));",
  " col+=c2*ray*rays*smoothstep(0.,.06,q.y)*exp(-length(q)*1.5)*.55*warm;",
  " col=mix(col,c0*.85,smoothstep(0.,-.1,d)*.55);",
  " vec2 sp=p*vec2(70.);vec2 g=floor(sp);vec2 f=fract(sp)-.5;float s=hash(g);",
  " vec2 o=vec2(hash(g+1.3),hash(g+7.1))-.5;float dd=length(f-o*.7);",
  " float tw=.55+.45*sin(t*1.3+s*60.);",
  " float star=smoothstep(.11,0.,dd)*step(.982,s)*tw*smoothstep(h+.04,h+.35,uv.y);",
  " col+=vec3(1.,.95,.86)*star*stars;",
  " col+=(hash(gl_FragCoord.xy+fract(t*.37)*91.)-.5)*.03;",
  " gl_FragColor=vec4(col,1.);",
  "}",
].join("\n");

export interface ShaderParams {
  c0: string;
  c1: string;
  c2: string;
  c3: string;
  stars: number;
  rays: number;
  warm: number;
  h: number;
}

export interface MountOptions extends Partial<ShaderParams> {
  /** Screen-blended WebGPU godrays layer. Defaults on, but needs navigator.gpu. */
  godrays?: boolean;
  layerOpacity?: number;
  raysY?: number;
}

export interface ShaderHandle {
  update(o: Partial<ShaderParams>): void;
  setPaused(v: boolean): void;
  destroy(): void;
}

export type PresetName = "night" | "dawn" | "glory";

export const PRESETS: Record<PresetName, ShaderParams> = {
  night: { c0: "#0B0D17", c1: "#1f1840", c2: "#D4A64A", c3: "#E08A4F", stars: 1, rays: 0.6, warm: 0.6, h: 0.12 },
  dawn: { c0: "#100e1f", c1: "#4f2a32", c2: "#E08A4F", c3: "#F2C48A", stars: 0.25, rays: 0.9, warm: 1, h: -0.03 },
  glory: { c0: "#0B0D17", c1: "#161a30", c2: "#D4A64A", c3: "#E08A4F", stars: 0.6, rays: 1, warm: 0.8, h: -0.05 },
};

function hex(x: string): [number, number, number] {
  const n = parseInt(x.slice(1), 16);
  return [((n >> 16) & 255) / 255, ((n >> 8) & 255) / 255, (n & 255) / 255];
}

const NOOP: ShaderHandle = { update() {}, setPaused() {}, destroy() {} };

interface ShadersLib {
  createShader(
    el: HTMLCanvasElement,
    cfg: { components: Array<{ type: string; id: string; props: Record<string, unknown> }> },
  ): Promise<{ destroy?: () => void }>;
}

/**
 * The godrays layer lives on a CDN and is only reachable at runtime, so the URL
 * is kept in a variable to stop the bundler trying to resolve it at build time.
 */
function loadShadersLib(): Promise<ShadersLib> {
  const url = "https://esm.sh/shaders/js";
  return import(/* webpackIgnore: true */ /* @vite-ignore */ url) as Promise<ShadersLib>;
}

export function mount(canvas: HTMLCanvasElement, name: PresetName, opts: MountOptions = {}): ShaderHandle {
  const P: ShaderParams = { ...(PRESETS[name] ?? PRESETS.night), ...opts };

  const gl = canvas.getContext("webgl", {
    antialias: false,
    powerPreference: "low-power",
    preserveDrawingBuffer: true,
  });
  if (!gl) return NOOP;

  const sh = (type: number, src: string) => {
    const s = gl.createShader(type)!;
    gl.shaderSource(s, src);
    gl.compileShader(s);
    return s;
  };

  const pr = gl.createProgram()!;
  gl.attachShader(pr, sh(gl.VERTEX_SHADER, VS));
  gl.attachShader(pr, sh(gl.FRAGMENT_SHADER, FS));
  gl.linkProgram(pr);
  if (!gl.getProgramParameter(pr, gl.LINK_STATUS)) return NOOP;
  gl.useProgram(pr);

  const b = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, b);
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 3, -1, -1, 3]), gl.STATIC_DRAW);
  const loc = gl.getAttribLocation(pr, "a");
  gl.enableVertexAttribArray(loc);
  gl.vertexAttribPointer(loc, 2, gl.FLOAT, false, 0, 0);

  const U: Record<string, WebGLUniformLocation | null> = {};
  for (const k of ["r", "t", "h", "stars", "rays", "warm", "c0", "c1", "c2", "c3"]) {
    U[k] = gl.getUniformLocation(pr, k);
  }

  const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  let visible = true;
  let raf = 0;
  let paused = false;
  let t0 = performance.now();
  let tFrozen = 12;

  function resize() {
    const d = Math.min(window.devicePixelRatio || 1, 1.5);
    const w = Math.max(1, Math.round(canvas.clientWidth * d));
    const hh = Math.max(1, Math.round(canvas.clientHeight * d));
    if (canvas.width !== w || canvas.height !== hh) {
      canvas.width = w;
      canvas.height = hh;
      gl!.viewport(0, 0, w, hh);
    }
  }

  function draw(t: number) {
    resize();
    gl!.uniform2f(U.r, canvas.width, canvas.height);
    gl!.uniform1f(U.t, t);
    gl!.uniform1f(U.h, P.h);
    gl!.uniform1f(U.stars, P.stars);
    gl!.uniform1f(U.rays, P.rays);
    gl!.uniform1f(U.warm, P.warm);
    gl!.uniform3fv(U.c0, hex(P.c0));
    gl!.uniform3fv(U.c1, hex(P.c1));
    gl!.uniform3fv(U.c2, hex(P.c2));
    gl!.uniform3fv(U.c3, hex(P.c3));
    gl!.drawArrays(gl!.TRIANGLES, 0, 3);
  }

  const now = () => (reduce || paused ? tFrozen : (performance.now() - t0) / 1000);

  function loop() {
    raf = 0;
    if (!visible) return;
    draw(now());
    if (!reduce && !paused) raf = requestAnimationFrame(loop);
  }

  const io = new IntersectionObserver((e) => {
    visible = e[0].isIntersecting;
    if (visible && !raf) loop();
  });
  io.observe(canvas);

  const ro = new ResizeObserver(() => {
    if (reduce || paused) draw(now());
  });
  ro.observe(canvas);

  canvas.dataset.engine = "webgl";
  loop();

  // Optional WebGPU godrays layer, screen-blended over the WebGL sky.
  let lib: { destroy?: () => void } | null = null;
  let layer: HTMLCanvasElement | null = null;

  if (opts.godrays !== false && "gpu" in navigator && !reduce && canvas.parentNode) {
    layer = document.createElement("canvas");
    layer.setAttribute("aria-hidden", "true");
    layer.style.cssText =
      "position:absolute;inset:0;width:100%;height:100%;mix-blend-mode:screen;opacity:" +
      (opts.layerOpacity ?? 0.35) +
      ";pointer-events:none;";
    canvas.parentNode.insertBefore(layer, canvas.nextSibling);

    loadShadersLib()
      .then((m) =>
        m.createShader(layer!, {
          components: [
            {
              type: "Godrays",
              id: "rays",
              props: {
                center: { x: 0.5, y: opts.raysY ?? 1 },
                rayColor: P.c2,
                intensity: 0.5,
                density: 0.22,
                spotty: 0.5,
                speed: 0.12,
                backgroundColor: "transparent",
              },
            },
          ],
        }),
      )
      .then((s) => {
        lib = s;
        if (layer) layer.dataset.engine = "shaders.com";
      })
      .catch(() => {
        if (layer) layer.remove();
        layer = null;
      });
  }

  return {
    update(o) {
      Object.assign(P, o);
      if (reduce || paused) draw(now());
    },
    setPaused(v) {
      if (v && !paused) tFrozen = (performance.now() - t0) / 1000;
      if (!v && paused) t0 = performance.now() - tFrozen * 1000;
      paused = v;
      if (!v && !raf) loop();
      else draw(now());
      if (layer) layer.style.visibility = v ? "hidden" : "visible";
    },
    destroy() {
      cancelAnimationFrame(raf);
      io.disconnect();
      ro.disconnect();
      if (lib && lib.destroy) lib.destroy();
      if (layer) layer.remove();
    },
  };
}
