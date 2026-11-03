import { useEffect, useRef, useState } from 'react';
import { Play } from 'lucide-react';
import './SaigonFilm.css';

interface FilmChapter {
  id: string;
  title: string;
  vietnamese: string;
  timeSec: number;
  timeLabel: string;
  thumb: string;
  desc: string;
}

const FILM_CHAPTERS: FilmChapter[] = [
  {
    id: 'skyline',
    title: 'Saigon River & Landmark 81',
    vietnamese: 'Toàn Cảnh Sài Gòn',
    timeSec: 4,
    timeLabel: '0:04',
    thumb: '/assets/scene-skyline.jpg',
    desc: 'Soaring above the Saigon River toward towering Landmark 81.',
  },
  {
    id: 'heritage',
    title: 'Notre-Dame & Scooters',
    vietnamese: 'Nhà Thờ Đức Bà',
    timeSec: 17,
    timeLabel: '0:17',
    thumb: '/assets/scene-heritage.jpg',
    desc: 'Iconic red-brick cathedral spires and the electric pulse of Saigon.',
  },
  {
    id: 'streetfood',
    title: 'Saigon Street Feast',
    vietnamese: 'Ẩm Thực Đường Phố',
    timeSec: 35,
    timeLabel: '0:35',
    thumb: '/assets/scene-streetfood.jpg',
    desc: 'Steaming Bánh Cuốn, Gỏi Cuốn, and night-market culinary magic.',
  },
  {
    id: 'fellowship',
    title: 'IBF Brotherhood',
    vietnamese: 'Hội Ngộ Quốc Tế',
    timeSec: 50,
    timeLabel: '0:50',
    thumb: '/assets/scene-fellowship.jpg',
    desc: 'Cold brews, cà phê sữa đá, and camaraderie on Saigon avenues.',
  },
  {
    id: 'nightcruise',
    title: 'Saigon River Gala Cruise',
    vietnamese: 'Du Thuyền Sông Sài Gòn',
    timeSec: 67,
    timeLabel: '1:07',
    thumb: '/assets/scene-nightcruise.jpg',
    desc: 'Gliding across neon-lit waters under the glittering skyline.',
  },
  {
    id: 'welcome',
    title: 'Championship Welcome',
    vietnamese: 'Chào Mừng Quý Khách',
    timeSec: 84,
    timeLabel: '1:24',
    thumb: '/assets/scene-welcome.jpg',
    desc: 'Five-star Vietnamese hospitality awaiting every qualifier in 2028.',
  },
];

export function SaigonFilm({ onPlaybackChange }: { onPlaybackChange: (playing: boolean) => void }) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [hasStarted, setHasStarted] = useState(false);
  const [isBuffering, setIsBuffering] = useState(false);
  const [activeChapter, setActiveChapter] = useState<string | null>(null);
  const [playbackError, setPlaybackError] = useState<string | null>(null);

  useEffect(() => () => onPlaybackChange(false), [onPlaybackChange]);

  const syncChapter = (video: HTMLVideoElement) => {
    let chapterId: string | null = null;
    for (const chapter of FILM_CHAPTERS) {
      if (video.currentTime < chapter.timeSec) break;
      chapterId = chapter.id;
    }
    setActiveChapter(chapterId);
  };

  const reportPlayback = (playing: boolean) => {
    setIsPlaying(playing);
    onPlaybackChange(playing);
  };

  const showPlayFailure = (error: unknown) => {
    const video = videoRef.current;
    // A newer native play action may have already succeeded after an interrupted request.
    if (!video || (!video.paused && !video.error)) return;
    if (video.error) {
      setPlaybackError('The film couldn’t load here. Open the video below to watch it directly.');
    } else if (error instanceof DOMException && error.name === 'AbortError') {
      setPlaybackError('Playback was interrupted. Use the video’s play control, or open the video below.');
    } else {
      setPlaybackError('Playback couldn’t start. Use the video’s play control, or open the video below.');
    }
    setIsBuffering(false);
  };

  const playFilm = () => {
    const video = videoRef.current;
    if (!video) return;
    setPlaybackError(null);
    try {
      void video.play().catch(showPlayFailure);
    } catch (error) {
      showPlayFailure(error);
    }
  };

  const jumpToChapter = (chapter: FilmChapter) => {
    const video = videoRef.current;
    if (!video) return;
    try {
      video.currentTime = chapter.timeSec;
    } catch {
      setPlaybackError('This scene isn’t ready. Start the film with its play control, then choose a scene.');
      return;
    }
    // Keep play within the tap/keyboard gesture; scrolling must not defer it.
    playFilm();
    stageRef.current?.scrollIntoView({ block: 'nearest', inline: 'nearest', behavior: 'instant' });
  };

  return (
    <div className="film-frame">
      <div ref={stageRef} className="film-stage" data-playing={isPlaying || undefined}>
        <video
          ref={videoRef}
          className="film-video"
          src="/assets/saigon-2028.mp4"
          poster="/assets/poster-main.jpg"
          controls
          playsInline
          preload="metadata"
          aria-label="Official Saigon 2028 film"
          onPlay={(event) => {
            setHasStarted(true);
            setPlaybackError(null);
            setIsBuffering(event.currentTarget.readyState < HTMLMediaElement.HAVE_FUTURE_DATA);
            reportPlayback(true);
          }}
          onPlaying={() => {
            setPlaybackError(null);
            setIsBuffering(false);
          }}
          onPause={() => {
            setIsBuffering(false);
            reportPlayback(false);
          }}
          onEnded={() => {
            setIsBuffering(false);
            reportPlayback(false);
          }}
          onError={() => {
            setPlaybackError('The film couldn’t load here. Open the video below to watch it directly.');
            setIsBuffering(false);
            reportPlayback(false);
          }}
          onWaiting={(event) => setIsBuffering(!event.currentTarget.paused)}
          onStalled={(event) => {
            const video = event.currentTarget;
            setIsBuffering(!video.paused && video.readyState < HTMLMediaElement.HAVE_FUTURE_DATA);
          }}
          onCanPlay={() => setIsBuffering(false)}
          onTimeUpdate={(event) => syncChapter(event.currentTarget)}
          onSeeked={(event) => syncChapter(event.currentTarget)}
          onLoadedMetadata={(event) => syncChapter(event.currentTarget)}
        />
        {!hasStarted && !playbackError && (
          <div className="film-play-prompt">
            <button type="button" className="film-play-button" onClick={playFilm}>
              <Play size={26} fill="currentColor" aria-hidden="true" />
              <span>Play film</span>
            </button>
          </div>
        )}
      </div>

      <div className="film-watch-notes">
        <p className="film-hint">Sound on for Saigon. Use the video controls for sound and fullscreen.</p>
        <a className="film-open-link" href="/assets/saigon-2028.mp4" target="_blank" rel="noopener noreferrer">
          Open video <span className="film-link-note">(new tab)</span>
        </a>
      </div>
      <p className="film-status" role="status">{isBuffering ? 'Buffering film…' : ''}</p>
      {playbackError && <p className="film-error" role="alert">{playbackError}</p>}

      <details className="film-scenes">
        <summary className="film-scenes-summary">Explore the film · 6 scenes</summary>
        <div className="film-chapters">
          {FILM_CHAPTERS.map((chapter) => (
            <button
              key={chapter.id}
              type="button"
              className="film-chapter"
              aria-current={activeChapter === chapter.id ? 'true' : undefined}
              onClick={() => jumpToChapter(chapter)}
            >
              <span className="film-thumb-wrap" aria-hidden="true">
                <img className="film-thumb" src={chapter.thumb} alt="" width="88" height="56" loading="lazy" />
                <span className="film-time">{chapter.timeLabel}</span>
              </span>
              <span className="film-chapter-copy">
                <span className="film-chapter-vietnamese" lang="vi">{chapter.vietnamese}</span>
                <strong className="film-chapter-title">{chapter.title}</strong>
                <span className="film-chapter-desc">{chapter.desc}</span>
                <span className="film-chapter-cue">
                  {activeChapter === chapter.id ? 'Current scene' : `Play from ${chapter.timeLabel}`}
                </span>
              </span>
            </button>
          ))}
        </div>
      </details>
    </div>
  );
}
