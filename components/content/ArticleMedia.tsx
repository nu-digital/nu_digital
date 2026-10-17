"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";
import "./article-media.css";

type Photo = { src: string; alt: string };

export default function ArticleMedia({ children }: { children: ReactNode }) {
  const content = useRef<HTMLDivElement>(null);
  const dialog = useRef<HTMLDialogElement>(null);
  const opener = useRef<HTMLImageElement | null>(null);
  const [photos, setPhotos] = useState<Photo[]>([]);
  const [index, setIndex] = useState<number | null>(null);
  const opened = index !== null;

  useEffect(() => {
    if (!opened) return;
    const modal = dialog.current;
    const overflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    modal?.showModal();
    return () => {
      modal?.close();
      document.body.style.overflow = overflow;
      opener.current?.focus({ preventScroll: true });
    };
  }, [opened]);

  function open(target: EventTarget | null) {
    if (!(target instanceof HTMLImageElement) || !content.current) return;
    const images = Array.from(content.current.querySelectorAll("img"));
    const selected = images.indexOf(target);
    if (selected < 0) return;
    opener.current = target;
    setPhotos(images.map(image => ({ src: image.currentSrc || image.src, alt: image.alt })));
    setIndex(selected);
  }
  function move(direction: number) {
    setIndex(value => value === null ? null : (value + direction + photos.length) % photos.length);
  }

  return (
    <>
      <div ref={content} onClick={event => {
        if (event.target instanceof HTMLImageElement) { event.preventDefault(); open(event.target); }
      }} onKeyDown={event => {
        if (event.target instanceof HTMLImageElement && ["Enter", " "].includes(event.key)) { event.preventDefault(); open(event.target); }
      }}>{children}</div>
      <dialog ref={dialog} className="photo-lightbox" aria-label="写真の拡大表示" onCancel={() => setIndex(null)} onClose={() => setIndex(null)} onClick={event => {
        if (event.target === event.currentTarget) setIndex(null);
      }} onKeyDown={event => {
        if (event.key === "ArrowLeft") { event.preventDefault(); move(-1); }
        if (event.key === "ArrowRight") { event.preventDefault(); move(1); }
      }}>
        {index !== null && photos[index] && <>
          <div className="photo-lightbox-toolbar"><span aria-live="polite">{index + 1} / {photos.length}</span><button type="button" autoFocus onClick={() => setIndex(null)} aria-label="拡大表示を閉じる">閉じる ×</button></div>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img className="photo-lightbox-image" src={photos[index].src} alt={photos[index].alt} />
          {photos.length > 1 && <div className="photo-lightbox-navigation"><button type="button" onClick={() => move(-1)} aria-label="前の写真">← 前へ</button><button type="button" onClick={() => move(1)} aria-label="次の写真">次へ →</button></div>}
        </>}
      </dialog>
    </>
  );
}
