import Image from 'next/image';
import { cn } from '@/lib/utils';

interface AuthorProfileProps {
  name: string;
  bio: string;
  avatar: string;
  locale: string;
}

export function AuthorProfile({ name, bio, avatar, locale }: AuthorProfileProps) {
  const isRtl = locale === 'he';

  return (
    <div className={cn(
      "flex items-center gap-4 py-6 border-t border-neutral-800",
      isRtl && "flex-row-reverse"
    )}>
      <Image
        src={avatar}
        alt={name}
        width={64}
        height={64}
        className="rounded-full"
      />
      <div className={cn(isRtl && "text-end")}>
        <p className="font-semibold text-white">
          <bdi>{name}</bdi>
        </p>
        <p className="text-sm text-neutral-400 mt-1">
          {bio}
        </p>
      </div>
    </div>
  );
}
