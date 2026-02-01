precision highp float;

// Standard Attributes
attribute vec3 position;
attribute vec3 normal;
attribute vec2 uv;   // Texture mapping
attribute vec2 uv2;  // Secondary (unused here)
attribute vec2 uv3;  // VAT Lookup Coordinates (fbx.uv2)

// Uniforms
uniform mat4 modelViewMatrix;
uniform mat4 projectionMatrix;
uniform mat3 normalMatrix;

uniform sampler2D uPosMap;   // The Position VAT Texture
uniform float uTime;         // Current time/frame
uniform float uFPS;          // Animation speed (e.g., 30.0)
uniform float uTotalFrames;  // Number of frames in the texture

varying vec2 vUv;
varying vec3 vNormal;

void main() {
    vUv = uv;

    // 1. Calculate the current frame row in the VAT
    float frame = mod(floor(uTime * uFPS), uTotalFrames);
    float frameStep = 1.0 / uTotalFrames;

    // 2. Offset the lookup Y coordinate based on the current frame
    // OpenVAT usually stores frames vertically
    vec2 vatLookup = vec2(uv3.x, uv3.y + (frame * frameStep));

    // 3. Fetch the displacement from the texture
    // We treat the RGB values as XYZ offsets
    vec3 displacement = texture2D(uPosMap, vatLookup).rgb;

    // 4. Combine original position with VAT data
    // Note: Some exporters require (position + displacement) 
    // while others replace position entirely with displacement.
    vec3 newPosition = position + displacement;

    vNormal = normalMatrix * normal;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(newPosition, 1.0);
}