import Image from 'next/image';

export function PhotoCarousel({ photos }: { photos: string[] }) {
  return (
    <div className="flex justify-center flex-wrap gap-5 mt-5">
      {photos.map((photo) => (
        <div key={photo} className="relative w-[300px] h-[375px]">
          <Image
            key={photo}
            src={photo}
            alt="photo"
            fill
            className="inline-block rounded-lg object-cover"
          />
        </div>
      ))}
    </div>
  );
}
