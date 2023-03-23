export const GhibliShader = {
  vertexShader: /* glsl */ `
    precision highp float;
    precision highp int;

    varying vec3 vNormal;
    varying vec3 vPosition;

    void main() {
      vNormal = normal;
      vPosition = position;
      gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
    }
  `,
  fragmentShader: /* glsl */ `
    precision highp float;
    precision highp int;

    uniform mat4 modelMatrix;

    varying vec3 vNormal;
    varying vec3 vPosition;

    uniform vec3 colorMap[4];
    uniform float brightnessThresholds[3];
    uniform vec3 lightPosition;

    void main() {
      vec3 worldPosition = ( modelMatrix * vec4( vPosition, 1.0 )).xyz;
      vec3 worldNormal = normalize( vec3(modelMatrix * vec4( vNormal, 0.0 )));
      vec3 lightVector = normalize( lightPosition - worldPosition );
      float brightness = dot( worldNormal, lightVector );
      
      vec4 final;

      if(brightness > brightnessThresholds[0])
        final = vec4(colorMap[0], 1);
      else if(brightness > brightnessThresholds[1])
        final = vec4(colorMap[1], 1);
      else if(brightness > brightnessThresholds[2])
        final = vec4(colorMap[2], 1);
      else
        final = vec4(colorMap[3], 1);

      gl_FragColor = vec4( final );
    }
  `,
}