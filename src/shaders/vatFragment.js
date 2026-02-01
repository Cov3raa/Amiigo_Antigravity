precision highp float;

varying vec2 vUv;
varying vec3 vNormal;

void main() {
    // Basic lighting based on normals so you can see the 3D shape
    float light = dot(vNormal, normalize(vec3(1.0, 1.0, 1.0))) * 0.5 + 0.5;
    gl_FragColor = vec4(vec3(light), 1.0);
}