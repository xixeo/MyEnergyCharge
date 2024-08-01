import React, { useEffect, useState } from 'react';

const Icon = ({ name, width, height, className = '' }) => {
    const [svgPath, setSvgPath] = useState({ viewBox: '', d: '' });
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchSvgPath = async () => {
            try {
                // SVG 파일 로드
                const svgUrl = require(`../assets/icons/svg/${name}.svg`).default;
                console.log('SVG URL:', svgUrl); // SVG 파일 URL을 콘솔에 출력
                
                const response = await fetch(svgUrl);
                const text = await response.text();
                
                console.log('SVG Content:', text); // SVG 파일 내용을 콘솔에 출력

                // SVG 내용에서 viewBox와 d 속성 추출
                const viewBoxMatch = text.match(/viewBox="([^"]*)"/);
                const viewBox = viewBoxMatch ? viewBoxMatch[1] : '';

                const pathMatch = text.match(/<path[^>]*d="([^"]*)"/);
                const d = pathMatch ? pathMatch[1] : '';

                setSvgPath({ viewBox, d });
            } catch (error) {
                console.error('Error fetching SVG path:', error);
                setSvgPath({ viewBox: '', d: '' }); // 에러 발생 시 빈 경로와 빈 d 속성 설정
            } finally {
                setIsLoading(false);
            }
        };

        fetchSvgPath();
    }, [name]);

    return (
        <div
            style={{
                width: `${width}px`,
                height: `${height}px`,
                overflow: 'hidden',
                display: 'inline-block',
            }}
            className={className}
        >
            {isLoading ? (
                <div>Loading...</div>
            ) : (
                svgPath.d ? (
                    <svg
                        viewBox={svgPath.viewBox}
                        width={width}
                        height={height}
                        xmlns="http://www.w3.org/2000/svg"
                    >
                        <path d={svgPath.d} />
                    </svg>
                ) : (
                    <div>Icon not found</div>
                )
            )}
        </div>
    );
};

export default Icon;
