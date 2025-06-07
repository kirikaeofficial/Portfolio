import React, {useRef, useEffect, useState} from 'react';

const GridBackground = () => {
    const canvasRef = useRef(null);
    const [targetMousePos, setTargetMousePos] = useState({x: 0, y: 0});
    const mousePosRef = useRef({x: 0, y: 0});
    const particlesRef = useRef([]);
    const animationFrameRef = useRef();
    useRef(0);
    useEffect(() => {
        const canvas = canvasRef.current;
        const ctx = canvas.getContext('2d', {alpha: false});

        const resizeCanvas = () => {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
            initParticles();
        };

        const initParticles = () => {
            const particleCount = 100;
            particlesRef.current = Array(particleCount).fill().map(() => ({
                x: Math.random() * canvas.width,
                y: Math.random() * canvas.height,
                size: Math.random() * 1.5 + 0.5,
                speedX: (Math.random() - 0.5),
                speedY: (Math.random() - 0.5),
                hue: Math.random() * 40 + 320
            }));
        };

        window.addEventListener('resize', resizeCanvas);
        resizeCanvas();

        const drawScene = () => {
            const width = canvas.width;
            const height = canvas.height;

            ctx.fillStyle = 'rgb(8, 8, 18)';
            ctx.fillRect(0, 0, width, height);

            mousePosRef.current.x += (targetMousePos.x - mousePosRef.current.x) * 0.1;
            mousePosRef.current.y += (targetMousePos.y - mousePosRef.current.y) * 0.1;

            ctx.lineWidth = 0.5;
            ctx.shadowBlur = 0;

            particlesRef.current.forEach((particle, i) => {
                const dx = mousePosRef.current.x - particle.x;
                const dy = mousePosRef.current.y - particle.y;
                const dist = Math.sqrt(dx * dx + dy * dy);

                if (dist < 150) {
                    const angle = Math.atan2(dy, dx);
                    const force = (1 - dist / 150) * 0.6;
                    particle.speedX = Math.cos(angle) * force;
                    particle.speedY = Math.sin(angle) * force;
                }

                particle.x += particle.speedX;
                particle.y += particle.speedY;

                if (particle.x < 0) particle.x = width;
                if (particle.x > width) particle.x = 0;
                if (particle.y < 0) particle.y = height;
                if (particle.y > height) particle.y = 0;

                ctx.beginPath();
                ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
                const color = `hsla(${particle.hue}, 100%, 70%,`;
                ctx.fillStyle = color + '0.5)';
                ctx.fill();

                for (let j = i + 1; j < particlesRef.current.length; j++) {
                    const other = particlesRef.current[j];
                    const dx = other.x - particle.x;
                    const dy = other.y - particle.y;
                    const distance = Math.sqrt(dx * dx + dy * dy);

                    if (distance < 100) {
                        ctx.beginPath();
                        ctx.moveTo(particle.x, particle.y);
                        ctx.lineTo(other.x, other.y);
                        ctx.strokeStyle = color + `${0.3 * (1 - distance / 100)})`;
                        ctx.stroke();
                    }
                }
            });
        };

        const animate = () => {
            drawScene();
            animationFrameRef.current = requestAnimationFrame(animate);
        };

        animate();

        return () => {
            window.removeEventListener('resize', resizeCanvas);
            if (animationFrameRef.current) {
                cancelAnimationFrame(animationFrameRef.current);
            }
        };
    }, []);

    const handleMouseMove = (e) => {
        setTargetMousePos({x: e.clientX, y: e.clientY});
    };

    return (
        <canvas
            ref={canvasRef}
            style={{
                display: 'block',
                position: 'fixed',
                top: 0,
                left: 0,
                zIndex: -1
            }}
            onMouseMove={handleMouseMove}
        />
    );
};

export default GridBackground;