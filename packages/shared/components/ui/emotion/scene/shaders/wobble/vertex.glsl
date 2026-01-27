uniform float uTime;
uniform float uPositionFrequency;
uniform float uTimeFrequency;
uniform float uWarpPositionFrequency;
uniform float uWarpTimeFrequency;
uniform float uWarpStrength;

varying float vWobble;

float getWobble(vec3 position)
{
  vec3 warpedPosition = position;
  warpedPosition += simplexNoise4d(vec4(
    position * uWarpPositionFrequency,
    uTime * uWarpTimeFrequency
  )) * uWarpStrength;

  return simplexNoise4d(vec4(
    warpedPosition * uPositionFrequency,
    uTime * uTimeFrequency
  )); 
}

void main() 
{
  float noise = getWobble(csm_Position);

  vWobble = noise; 
}