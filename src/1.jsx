import React, {useRef, useEffect} from 'react';
import './IntroText.css';

const TechStack = () => {
    const offsetRef = useRef(0);
    const animationRef = useRef();
    const containerRef = useRef(null);
    const techStack = [
        {
            name: 'C',
            logo: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/c/c-original.svg'
        },
        {
            name: 'Java',
            logo: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/java/java-original.svg'
        },
        {
            name: 'Kotlin',
            logo: 'https://cdn.jsdelivr.net/gh/devicons/devicon/icons/kotlin/kotlin-original.svg'
        }
    ];

    useEffect(() => {
        let isAnimating = true;
        let lastTime = performance.now();

        const animate = (currentTime) => {
            if (!isAnimating) return;

            const deltaTime = currentTime - lastTime;
            lastTime = currentTime;

            offsetRef.current += 0.05 * deltaTime; // スピードをさらに遅く

            if (containerRef.current) {
                const techItems = containerRef.current.querySelectorAll('.tech-item');
                techItems.forEach((item, index) => {
                    const basePosition = index * 150;
                    let position = basePosition - offsetRef.current;

                    // 画面左端を超えたら右端に配置
                    if (position < -150) {
                        position += techItems.length * 150;
                    }

                    // フェードイン・アウト制御
                    let opacity = 1;
                    if (position < 0) {
                        opacity = Math.max(0, 1 + position / 150);
                    } else if (position > window.innerWidth - 150) {
                        opacity = Math.max(0, 1 - (position - (window.innerWidth - 150)) / 150);
                    }

                    item.style.transform = `translateX(${position}px)`;
                    item.style.opacity = opacity;
                    item.style.transition = 'none'; // transitionを無効化してスムーズな動きを実現

                    item.querySelectorAll('img').forEach(img => {
                        img.style.opacity = opacity;
                        img.style.transition = 'opacity 0.3s ease-out';
                    });
                });
            }

            animationRef.current = requestAnimationFrame(animate);
        };

        animationRef.current = requestAnimationFrame(animate);

        return () => {
            isAnimating = false;
            if (animationRef.current) {
                cancelAnimationFrame(animationRef.current);
            }
        };
    }, []);

    const repeatedStack = Array(25).fill(techStack).flat();

    return (
        <div className="tech-carousel" ref={containerRef}>
            <div className="tech-track">
                {repeatedStack.map((tech, index) => (
                    <div
                        key={`${tech.name}-${index}`}
                        className="tech-item"
                        style={{
                            opacity: 0,
                            transform: 'translateX(0px)',
                            transition: 'none' // 初期状態でもtransitionを無効化
                        }}
                    >
                        <img
                            src={tech.logo}
                            alt={tech.name}
                            className="tech-logo"
                            style={{
                                opacity: 0,
                                transition: 'opacity 0.3s ease-out'
                            }}
                            onLoad={(e) => {
                                e.target.style.filter = 'grayscale(100%) brightness(1.2) contrast(1.1)';
                            }}
                            onError={(e) => {
                                e.target.style.display = 'none';
                                const parent = e.target.parentElement;
                                if (!parent.querySelector('.fallback-logo')) {
                                    const fallbackDiv = document.createElement('div');
                                    fallbackDiv.className = 'fallback-logo';
                                    fallbackDiv.style.cssText = `
                                        width: 50px;
                                        height: 50px;
                                        background: #c0c0c0;
                                        border-radius: 8px;
                                        display: flex;
                                        align-items: center;
                                        justify-content: center;
                                        font-weight: bold;
                                        font-size: 12px;
                                        color: #171717;
                                        margin-bottom: 0.5rem;
                                    `;
                                    fallbackDiv.textContent = tech.name.slice(0, 2).toUpperCase();
                                    parent.insertBefore(fallbackDiv, e.target.nextElementSibling);
                                }
                            }}
                        />
                        <span className="tech-name">{tech.name}</span>
                    </div>
                ))}
            </div>
        </div>
    );
};

const IntroText = () => {
    return (
        <div className="intro-container">
            <div className="content-wrapper">
                <h1 className="main-title">Kirikae™</h1>
                <h2 className="subtitle">AI-Powered Engineer</h2>
                <p className="description">
                    AIと共に進化する開発者として<small><br/></small>
                    最新技術を駆使したソフトウェアなどを提供します
                    <small><br/></small>このサイトはClaude 4 Sonnetを使用して作られました
                </p>
                <TechStack/>
            </div>
        </div>
    );
};

export default IntroText;