import { useState } from 'react';

function VideoPlayer({ video }) {
  const [playbackRate, setPlaybackRate] = useState(1);
  const timestamps = JSON.parse(video.timestamps || '{}');

  return (
    <div style={{
      display: 'flex',
      gap: '2rem',
      padding: '2rem',
      backgroundColor: '#F8F9FA',
    }}>
      <div style={{ flex: 3 }}>
        <video controls src={video.video_path} style={{ width: '100%', borderRadius: '10px' }} playbackRate={playbackRate} />
        <div style={{ marginTop: '1rem' }}>
          <label>Playback Speed: </label>
          <select onChange={(e) => setPlaybackRate(e.target.value)} style={{ padding: '0.5rem' }}>
            <option value="0.5">0.5x</option>
            <option value="1">1x</option>
            <option value="1.5">1.5x</option>
            <option value="2">2x</option>
          </select>
        </div>
        <h3 style={{ color: '#1B263B', margin: '1rem 0' }}>{video.title}</h3>
        <p style={{ color: '#6B7280' }}>{video.description}</p>
        <div>
          <h4>Timestamps</h4>
          <ul>
            {Object.entries(timestamps).map(([time, label]) => (
              <li key={time}>
                <button onClick={() => console.log(`Jump to ${time}`)} style={{ color: '#FFD700' }}>
                  {time} - {label}
                </button>
              </li>
            ))}
          </ul>
        </div>
        <div>
          <h4>Notes</h4>
          <a href={video.notes_path} download style={{ color: '#FFD700' }}>Download Notes</a>
        </div>
        <div>
          <h4>Comments</h4>
          <textarea placeholder="Add a comment..." style={{ width: '100%', padding: '0.5rem' }} />
          <button style={{ backgroundColor: '#FFD700', padding: '0.5rem', borderRadius: '5px' }}>
            Post Comment
          </button>
        </div>
      </div>
      <div style={{ flex: 1 }}>
        <h4>Playlist</h4>
        {/* Placeholder for playlist videos */}
        <p>Next video...</p>
      </div>
    </div>
  );
}

export default VideoPlayer;