// ═════════════════════════════════════════════════════════════════════════════
// RISE OF A LEGEND — Portcullis Gate Animation (Grade Medieval)
// Grade/rastrillo que desce com correntes, estilo castelo medieval
// Som de correntes + metal batendo
// ═════════════════════════════════════════════════════════════════════════════

function PortcullisGateAnimation({ onComplete }) {
  React.useEffect(() => {
    // Som aprimorado de grade descendo (correntes realistas + impacto pesado)
    const playGateSound = () => {
      try {
        const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
        const now = audioCtx.currentTime;
        
        // 1. Som de engrenagens rangendo (inicio)
        const gearNoise = audioCtx.createBufferSource();
        const gearBuffer = audioCtx.createBuffer(1, audioCtx.sampleRate * 0.5, audioCtx.sampleRate);
        const gearData = gearBuffer.getChannelData(0);
        for (let i = 0; i < gearData.length; i++) {
          const t = i / audioCtx.sampleRate;
          gearData[i] = (Math.random() * 2 - 1) * 0.15 * Math.sin(t * 800) * (1 - t * 2);
        }
        gearNoise.buffer = gearBuffer;
        const gearGain = audioCtx.createGain();
        gearGain.gain.setValueAtTime(0.3, now);
        gearGain.gain.linearRampToValueAtTime(0, now + 0.5);
        gearNoise.connect(gearGain).connect(audioCtx.destination);
        gearNoise.start(now);
        
        // 2. Correntes tilintando (progressivo durante descida)
        const chainNoise = audioCtx.createBufferSource();
        const chainBuffer = audioCtx.createBuffer(1, audioCtx.sampleRate * 2.2, audioCtx.sampleRate);
        const chainData = chainBuffer.getChannelData(0);
        for (let i = 0; i < chainData.length; i++) {
          const t = i / audioCtx.sampleRate;
          const rattle = Math.sin(t * 35) * (Math.random() * 2 - 1);
          const envelope = Math.min(1, t * 3) * Math.exp(-t * 0.8);
          chainData[i] = rattle * 0.25 * envelope;
        }
        chainNoise.buffer = chainBuffer;
        
        const chainFilter = audioCtx.createBiquadFilter();
        chainFilter.type = 'highpass';
        chainFilter.frequency.value = 800;
        chainFilter.Q.value = 3;
        
        const chainGain = audioCtx.createGain();
        chainGain.gain.setValueAtTime(0, now + 0.1);
        chainGain.gain.linearRampToValueAtTime(0.5, now + 0.3);
        chainGain.gain.linearRampToValueAtTime(0.4, now + 1.8);
        chainGain.gain.linearRampToValueAtTime(0, now + 2.2);
        
        chainNoise.connect(chainFilter).connect(chainGain).connect(audioCtx.destination);
        chainNoise.start(now + 0.1);
        
        // 3. Fricção da grade descendo (metal contra pedra)
        const frictionNoise = audioCtx.createBufferSource();
        const frictionBuffer = audioCtx.createBuffer(1, audioCtx.sampleRate * 1.8, audioCtx.sampleRate);
        const frictionData = frictionBuffer.getChannelData(0);
        for (let i = 0; i < frictionData.length; i++) {
          const t = i / audioCtx.sampleRate;
          frictionData[i] = (Math.random() * 2 - 1) * 0.18 * (1 - Math.exp(-t * 5));
        }
        frictionNoise.buffer = frictionBuffer;
        
        const frictionFilter = audioCtx.createBiquadFilter();
        frictionFilter.type = 'bandpass';
        frictionFilter.frequency.value = 600;
        frictionFilter.Q.value = 1.5;
        
        const frictionGain = audioCtx.createGain();
        frictionGain.gain.setValueAtTime(0.3, now + 0.2);
        frictionGain.gain.linearRampToValueAtTime(0, now + 1.9);
        
        frictionNoise.connect(frictionFilter).connect(frictionGain).connect(audioCtx.destination);
        frictionNoise.start(now + 0.2);
        
        // 4. SLAM final (impacto pesado multi-camadas)
        const slamTime = now + 1.9;
        
        // Camada grave (estrutura tremendo)
        const bass = audioCtx.createOscillator();
        const bassGain = audioCtx.createGain();
        bass.frequency.setValueAtTime(45, slamTime);
        bass.frequency.exponentialRampToValueAtTime(35, slamTime + 0.4);
        bassGain.gain.setValueAtTime(0.6, slamTime);
        bassGain.gain.exponentialRampToValueAtTime(0.01, slamTime + 0.8);
        bass.connect(bassGain).connect(audioCtx.destination);
        bass.start(slamTime);
        bass.stop(slamTime + 0.8);
        
        // Camada médio-grave (metal batendo)
        const metal = audioCtx.createOscillator();
        const metalGain = audioCtx.createGain();
        metal.frequency.setValueAtTime(180, slamTime);
        metal.frequency.exponentialRampToValueAtTime(80, slamTime + 0.3);
        metalGain.gain.setValueAtTime(0.4, slamTime);
        metalGain.gain.exponentialRampToValueAtTime(0.01, slamTime + 0.5);
        metal.connect(metalGain).connect(audioCtx.destination);
        metal.start(slamTime);
        metal.stop(slamTime + 0.5);
        
        // Impacto agudo (pontas batendo no chão)
        const impact = audioCtx.createBufferSource();
        const impactBuffer = audioCtx.createBuffer(1, audioCtx.sampleRate * 0.3, audioCtx.sampleRate);
        const impactData = impactBuffer.getChannelData(0);
        for (let i = 0; i < impactData.length; i++) {
          const t = i / audioCtx.sampleRate;
          impactData[i] = (Math.random() * 2 - 1) * 0.6 * Math.exp(-t * 15);
        }
        impact.buffer = impactBuffer;
        
        const impactFilter = audioCtx.createBiquadFilter();
        impactFilter.type = 'highpass';
        impactFilter.frequency.value = 2000;
        
        const impactGain = audioCtx.createGain();
        impactGain.gain.setValueAtTime(0.5, slamTime);
        impactGain.gain.exponentialRampToValueAtTime(0.01, slamTime + 0.3);
        
        impact.connect(impactFilter).connect(impactGain).connect(audioCtx.destination);
        impact.start(slamTime);
        
        // 5. Reverb longo (eco da câmara de pedra)
        const convolver = audioCtx.createConvolver();
        const reverbBuffer = audioCtx.createBuffer(2, audioCtx.sampleRate * 2, audioCtx.sampleRate);
        for (let channel = 0; channel < 2; channel++) {
          const channelData = reverbBuffer.getChannelData(channel);
          for (let i = 0; i < channelData.length; i++) {
            const t = i / audioCtx.sampleRate;
            channelData[i] = (Math.random() * 2 - 1) * Math.exp(-t * 1.5) * 0.5;
          }
        }
        convolver.buffer = reverbBuffer;
        
        const reverbGain = audioCtx.createGain();
        reverbGain.gain.value = 0.4;
        
        bassGain.connect(convolver).connect(reverbGain).connect(audioCtx.destination);
        metalGain.connect(convolver);
        
      } catch (e) {
        console.log('Audio not available');
      }
    };
    
    playGateSound();
    
    const timer = setTimeout(() => {
      if (onComplete) onComplete();
    }, 3000);
    
    return () => clearTimeout(timer);
  }, [onComplete]);

  return (
    <div style={{
      position: 'fixed',
      inset: 0,
      zIndex: 999,
      pointerEvents: 'none',
      overflow: 'hidden',
      background: 'radial-gradient(circle at 50% 50%, rgba(26,28,46,0.8), rgba(0,0,0,0.95))',
      animation: 'gate-darken 0.8s ease-out',
    }}>
      
      {/* Estrutura do castelo */}
      <div style={{
        position: 'absolute',
        left: '50%',
        top: '50%',
        transform: 'translate(-50%, -50%)',
        width: '600px',
        maxWidth: '90vw',
        height: '500px',
        maxHeight: '80vh',
      }}>
        
        {/* Parede de pedra + arco */}
        <svg viewBox="0 0 600 500" width="100%" height="100%"
          style={{ position: 'absolute', inset: 0 }}>
          <defs>
            <pattern id="stone-texture" x="0" y="0" width="40" height="40" patternUnits="userSpaceOnUse">
              <rect width="40" height="40" fill="#5A5A6A" />
              <rect x="0" y="0" width="38" height="18" fill="#656575" stroke="#45454F" strokeWidth="1" />
              <rect x="0" y="20" width="38" height="18" fill="#606070" stroke="#45454F" strokeWidth="1" />
            </pattern>
            
            <linearGradient id="torch-flame" x1="0%" y1="100%" x2="0%" y2="0%">
              <stop offset="0%" stopColor="#FF6B00" />
              <stop offset="50%" stopColor="#FFB020" />
              <stop offset="100%" stopColor="#FFD700" stopOpacity="0.8" />
            </linearGradient>
            
            <filter id="torch-glow">
              <feGaussianBlur stdDeviation="4" />
            </filter>
          </defs>
          
          {/* Parede esquerda */}
          <rect x="0" y="0" width="200" height="500" fill="url(#stone-texture)" />
          
          {/* Parede direita */}
          <rect x="400" y="0" width="200" height="500" fill="url(#stone-texture)" />
          
          {/* Arco superior */}
          <path d="M 200 120 Q 300 50, 400 120 L 400 500 L 200 500 Z"
            fill="url(#stone-texture)"
            stroke="#3A3A4A"
            strokeWidth="3" />
          
          {/* Detalhes das pedras do arco */}
          <path d="M 210 500 L 210 200 Q 300 130, 390 200 L 390 500"
            fill="none"
            stroke="#45454F"
            strokeWidth="2"
            opacity="0.6" />
          
          {/* Tochas esquerda */}
          <g transform="translate(150, 180)">
            <rect x="-8" y="0" width="16" height="60" fill="#4A3A2A" rx="2" />
            <ellipse cx="0" cy="-10" rx="20" ry="35" 
              fill="url(#torch-flame)"
              opacity="0.9"
              style={{ animation: 'torch-flicker 1.5s ease-in-out infinite' }}>
              <animate attributeName="ry" values="35;40;32;38;35" dur="1.5s" repeatCount="indefinite" />
            </ellipse>
            <ellipse cx="0" cy="-10" rx="25" ry="40" 
              fill="url(#torch-flame)"
              opacity="0.3"
              filter="url(#torch-glow)" />
          </g>
          
          {/* Tochas direita */}
          <g transform="translate(450, 180)">
            <rect x="-8" y="0" width="16" height="60" fill="#4A3A2A" rx="2" />
            <ellipse cx="0" cy="-10" rx="20" ry="35" 
              fill="url(#torch-flame)"
              opacity="0.9"
              style={{ animation: 'torch-flicker 1.5s ease-in-out infinite 0.5s' }}>
              <animate attributeName="ry" values="35;38;33;39;35" dur="1.5s" repeatCount="indefinite" />
            </ellipse>
            <ellipse cx="0" cy="-10" rx="25" ry="40" 
              fill="url(#torch-flame)"
              opacity="0.3"
              filter="url(#torch-glow)" />
          </g>
        </svg>
        
        {/* Correntes */}
        <svg viewBox="0 0 600 500" width="100%" height="100%"
          style={{ position: 'absolute', inset: 0, zIndex: 2 }}>
          {/* Corrente esquerda */}
          <g style={{ animation: 'chain-rattle 2s ease-out' }}>
            <line x1="240" y1="100" x2="240" y2="480" 
              stroke="#4A4A5A" 
              strokeWidth="4"
              strokeLinecap="round" />
            {[...Array(12)].map((_, i) => (
              <ellipse key={i}
                cx="240"
                cy={120 + i * 30}
                rx="6" ry="10"
                fill="none"
                stroke="#4A4A5A"
                strokeWidth="3" />
            ))}
          </g>
          
          {/* Corrente direita */}
          <g style={{ animation: 'chain-rattle 2s ease-out 0.1s' }}>
            <line x1="360" y1="100" x2="360" y2="480" 
              stroke="#4A4A5A" 
              strokeWidth="4"
              strokeLinecap="round" />
            {[...Array(12)].map((_, i) => (
              <ellipse key={i}
                cx="360"
                cy={120 + i * 30}
                rx="6" ry="10"
                fill="none"
                stroke="#4A4A5A"
                strokeWidth="3" />
            ))}
          </g>
        </svg>
        
        {/* Grade/Rastrillo descendo */}
        <svg viewBox="0 0 600 500" width="100%" height="100%"
          style={{ 
            position: 'absolute', 
            inset: 0,
            zIndex: 3,
            animation: 'portcullis-drop 2s cubic-bezier(0.68, -0.55, 0.265, 1.55) forwards',
          }}>
          <defs>
            <linearGradient id="metal-bar" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#7A7A8A" />
              <stop offset="30%" stopColor="#5A5A6A" />
              <stop offset="60%" stopColor="#3A3A4A" />
              <stop offset="100%" stopColor="#4A4A5A" />
            </linearGradient>
            
            <linearGradient id="spike-gradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#5A5A6A" />
              <stop offset="100%" stopColor="#2A2A3A" />
            </linearGradient>
            
            <filter id="metal-shadow">
              <feGaussianBlur in="SourceAlpha" stdDeviation="2" />
              <feOffset dx="1" dy="2" result="offsetblur" />
              <feComponentTransfer>
                <feFuncA type="linear" slope="0.5" />
              </feComponentTransfer>
              <feMerge>
                <feMergeNode />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          </defs>
          
          {/* Barras verticais com textura */}
          {[0,1,2,3,4,5,6,7].map(i => (
            <g key={`v${i}`}>
              <rect
                x={220 + i * 20}
                y="120"
                width="12"
                height="380"
                fill="url(#metal-bar)"
                stroke="#2A2A3A"
                strokeWidth="1.5"
                rx="3"
                filter="url(#metal-shadow)" />
              {/* Rebites decorativos */}
              {[0,1,2,3,4].map(j => (
                <circle key={j}
                  cx={226 + i * 20}
                  cy={150 + j * 80}
                  r="2.5"
                  fill="#3A3A4A"
                  stroke="#1A1A2A"
                  strokeWidth="0.5" />
              ))}
            </g>
          ))}
          
          {/* Barras horizontais com textura */}
          {[0,1,2,3,4].map(i => (
            <g key={`h${i}`}>
              <rect
                x="220"
                y={130 + i * 90}
                width="160"
                height="12"
                fill="url(#metal-bar)"
                stroke="#2A2A3A"
                strokeWidth="1.5"
                rx="3"
                filter="url(#metal-shadow)" />
              {/* Detalhes de ferrugem/desgaste */}
              {[...Array(3)].map((_, j) => (
                <rect key={j}
                  x={230 + j * 50}
                  y={132 + i * 90}
                  width={5 + Math.random() * 3}
                  height="8"
                  fill="rgba(139,69,19,0.2)"
                  rx="1" />
              ))}
            </g>
          ))}
          
          {/* Pontas afiadas 3D na parte inferior */}
          {[0,1,2,3,4,5,6,7].map(i => (
            <g key={`spike${i}`}>
              {/* Sombra da ponta */}
              <path
                d={`M ${222 + i * 20} 500 L ${226 + i * 20} 478 L ${230 + i * 20} 500 Z`}
                fill="rgba(0,0,0,0.4)"
                transform="translate(1, 1)" />
              {/* Ponta principal */}
              <path
                d={`M ${222 + i * 20} 500 L ${226 + i * 20} 475 L ${230 + i * 20} 500 Z`}
                fill="url(#spike-gradient)"
                stroke="#1A1A2A"
                strokeWidth="1.5" />
              {/* Brilho na ponta */}
              <path
                d={`M ${224 + i * 20} 495 L ${226 + i * 20} 480 L ${226.5 + i * 20} 490 Z`}
                fill="rgba(255,255,255,0.3)" />
            </g>
          ))}
          
          {/* Brilho metálico nas barras */}
          {[0,1,2,3,4,5,6,7].map(i => (
            <rect key={`shine${i}`}
              x={221 + i * 20}
              y="130"
              width="4"
              height="360"
              fill="rgba(255,255,255,0.25)"
              rx="2"
              opacity="0.8" />
          ))}
          
          {/* Detalhes de oxidação/desgaste nas junções */}
          {[0,1,2,3,4].map(i => (
            <g key={`wear${i}`}>
              {[0,1,2,3,4,5,6,7].map(j => (
                <circle key={j}
                  cx={226 + j * 20}
                  cy={136 + i * 90}
                  r="3"
                  fill="rgba(139,69,19,0.15)" />
              ))}
            </g>
          ))}
        </svg>
      </div>
      
      {/* Poeira e partículas */}
      <div style={{ position: 'absolute', inset: 0, zIndex: 4 }}>
        {[...Array(20)].map((_, i) => (
          <div key={i} style={{
            position: 'absolute',
            left: `${40 + Math.random() * 20}%`,
            top: `${30 + Math.random() * 30}%`,
            width: 4,
            height: 4,
            borderRadius: '50%',
            background: 'rgba(200, 200, 200, 0.5)',
            animation: `dust-fall ${1.5 + Math.random() * 1}s ease-out ${1.8 + Math.random() * 0.3}s forwards`,
          }} />
        ))}
      </div>
      
      {/* Texto */}
      <div style={{
        position: 'absolute',
        bottom: '15%',
        left: '50%',
        transform: 'translateX(-50%)',
        animation: 'gate-text-appear 1s ease-out 1.2s forwards',
        opacity: 0,
        textAlign: 'center',
      }}>
        <div className="font-display" style={{
          fontSize: 28,
          fontWeight: 800,
          color: '#FFB020',
          textShadow: '0 0 20px rgba(255,176,32,0.6), 0 0 40px rgba(255,176,32,0.3)',
          letterSpacing: '0.05em',
        }}>
          🏰 MODO BLINDADO
        </div>
        <div style={{
          fontSize: 13,
          color: 'rgba(255,255,255,0.8)',
          marginTop: 8,
          letterSpacing: '0.1em',
        }}>
          A grade está trancada. Foco total até o fim!
        </div>
      </div>
    </div>
  );
}

// Inject keyframes
(function injectPortcullisAnimations() {
  if (document.getElementById('portcullis-animations')) return;
  const style = document.createElement('style');
  style.id = 'portcullis-animations';
  style.innerHTML = `
    @keyframes portcullis-drop {
      from { 
        transform: translateY(-100%); 
      }
      to { 
        transform: translateY(0); 
      }
    }
    
    @keyframes chain-rattle {
      0%, 100% { transform: translateX(0); }
      10%, 30%, 50%, 70%, 90% { transform: translateX(-2px) rotate(-0.5deg); }
      20%, 40%, 60%, 80% { transform: translateX(2px) rotate(0.5deg); }
    }
    
    @keyframes torch-flicker {
      0%, 100% { opacity: 0.9; }
      50% { opacity: 1; }
    }
    
    @keyframes gate-darken {
      from { opacity: 0; }
      to { opacity: 1; }
    }
    
    @keyframes gate-text-appear {
      from { 
        opacity: 0; 
        transform: translateX(-50%) translateY(20px); 
      }
      to { 
        opacity: 1; 
        transform: translateX(-50%) translateY(0); 
      }
    }
    
    @keyframes dust-fall {
      from { 
        opacity: 0.8; 
        transform: translateY(0) scale(1); 
      }
      to { 
        opacity: 0; 
        transform: translateY(80px) scale(0.3); 
      }
    }
  `;
  document.head.appendChild(style);
})();

window.PortcullisGateAnimation = PortcullisGateAnimation;
