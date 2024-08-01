import React, { useEffect, useState } from 'react';

const Icon = ({ name, width, height, className = '' }) => {
    const [SVG, setSVG] = useState(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        setIsLoading(true);
        import(`../assets/icons/svg/${name}.svg`)
            .then(mod => {
              console.log('SVG module:', mod); // SVG 모듈 확인
                setSVG(() => mod.ReactComponent); // ReactComponent를 사용하여 SVG를 컴포넌트로 변환
                setIsLoading(false);
            })
            .catch((err) => {
               console.error('Error loading SVG:', err); // 에러 확인
                setSVG(null);
                setIsLoading(false);
            });
    }, [name]);

    return (
        <div
            style={{
                width: `${width}px`,
                height: `${height}px`,
                display: 'inline-block',
            }}
            className={className}
        >
            {isLoading ? (
                <div>Loading...</div>
            ) : (
                SVG ? <SVG width={width} height={height} /> : <div>Icon not found</div>
            )}
        </div>
    );
};

export default Icon;
