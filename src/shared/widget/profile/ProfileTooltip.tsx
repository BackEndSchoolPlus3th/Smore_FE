import React, { useState, useEffect, useRef } from 'react';
import { User } from 'lucide-react';

interface ProfileTooltipProps {
    imageUrl: string | null;
    nickname: string;
    description: string | null;
    profileSize?: 'small' | 'medium' | 'large';
}

/**
 * 프로필 이미지에 마우스를 올리면 툴팁이 나타나는 위젯
 */
const ProfileTooltip: React.FC<ProfileTooltipProps> = ({
    imageUrl,
    nickname,
    description,
    profileSize = 'medium', // 기본값: w-12 h-12
}) => {
    const containerRef = useRef<HTMLDivElement>(null);
    const [tooltipPosition, setTooltipPosition] = useState('top-full left-0');

    // profileSize에 따른 Tailwind CSS 클래스 결정
    let sizeClasses = '';
    switch (profileSize) {
        case 'small':
            sizeClasses = 'w-8 h-8';
            break;
        case 'medium':
            sizeClasses = 'w-12 h-12';
            break;
        case 'large':
            sizeClasses = 'w-16 h-16';
            break;
        default:
            sizeClasses = 'w-12 h-12';
    }

    const computeTooltipPosition = () => {
        if (!containerRef.current) return;
        const rect = containerRef.current?.getBoundingClientRect();
        let verticalPosition = 'top-full';
        let horizontalPosition = 'left-0';

        // 수직 위치 결정: 프로필 요소의 top이 뷰포트 1/4보다 위면 tooltip은 아래에, 아니면 위에 배치
        if (rect.top < window.innerHeight / 4) {
            verticalPosition = 'top-full';
        } else {
            verticalPosition = 'bottom-full';
        }

        // 수평 위치 결정: 프로필 요소의 left가 뷰포트 1/4보다 왼쪽이면 tooltip은 왼쪽 정렬, 아니면 오른쪽 정렬
        if (rect.left < window.innerWidth / 4) {
            horizontalPosition = 'left-0';
        } else {
            horizontalPosition = 'right-0';
        }

        setTooltipPosition(`${verticalPosition} ${horizontalPosition}`);
    };

    useEffect(() => {
        computeTooltipPosition();
        window.addEventListener('resize', computeTooltipPosition);
        window.addEventListener('scroll', computeTooltipPosition);
        return () => {
            window.removeEventListener('resize', computeTooltipPosition);
            window.removeEventListener('scroll', computeTooltipPosition);
        };
    }, []);

    return (
        <div className="relative inline-block group" ref={containerRef}>
            {/* 프로필 이미지 */}
            {imageUrl ? (
                <img
                    src={imageUrl}
                    alt="profile"
                    className={`rounded-full ${sizeClasses}`}
                />
            ) : (
                <User
                    className={`rounded-full ${sizeClasses} border border-gray-300 text-gray-600`}
                />
            )}
            {/* 마우스 hover 시 나타나는 팝업 */}
            <div
                className={`absolute ${tooltipPosition} mt-2 p-2 bg-white border rounded shadow-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300`}
            >
                <p className="font-semibold">{nickname}</p>
                {description ? (
                    <p className="text-sm text-gray-600">{description}</p>
                ) : (
                    <p className="text-sm text-gray-600">
                        자기소개가 없습니다.
                    </p>
                )}
            </div>
        </div>
    );
};

export default ProfileTooltip;
