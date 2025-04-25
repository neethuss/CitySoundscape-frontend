"use client";

import { useEffect, useState, useRef } from "react";
import { soundElements } from "../sounds/files";
import { PauseCircle, PlayCircle, Volume2 } from "lucide-react";
import * as Tone from "tone";
import { addMix, editMix, getMixById } from "../api/soundscapeApi";
import { useNavigate, useParams } from "react-router-dom";
import { Toaster, toast } from "sonner";

// Interface for storing Tone.js Player and Gain
interface SoundPlayer {
  player: Tone.Player;
  gain: Tone.Gain;
}

const SoundElements = () => {
  const { id } = useParams<{ id: string }>();
  const isEdit = Boolean(id); // Whether the page is in edit mode
  const navigate = useNavigate();

  // State to track selected sounds
  const [selectedSounds, setSelectedSounds] = useState<Record<string, boolean>>(
    {}
  );
  const [isPlaying, setIsPlaying] = useState(false); // Whether mix is playing
  const [playingStates, setPlayingStates] = useState<Record<string, boolean>>(
    {}
  );
  const [volumes, setVolumes] = useState<Record<string, number>>({});
  const [mixName, setMixName] = useState(""); // Name of the mix

  // Ref to store Tone.Player and Gain objects
  const playersRef = useRef<Record<string, SoundPlayer>>({});

  // Fetch existing mix if editing
  useEffect(() => {
    const fetchMix = async () => {
      if (!id) return;
      try {
        const res = await getMixById(id);
        if (res?.data) {
          const mix = res.data;
          setMixName(mix.name);
          const selected: Record<string, boolean> = {};
          const vols: Record<string, number> = {};
          mix.sounds.forEach((sound: { id: string; volume: number }) => {
            selected[sound.id] = true;
            vols[sound.id] = sound.volume * 100;
          });
          setSelectedSounds(selected);
          setVolumes(vols);
        }
      } catch (error) {
        console.error("Error fetching mix:", error);
        toast.error("Failed to load the mix. Please try again.");
      }
    };

    fetchMix();
  }, [id]);

  // Initialize all sound players
  useEffect(() => {
    soundElements.forEach(({ id, url }) => {
      const gain = new Tone.Gain(1).toDestination();
      const player = new Tone.Player(url).connect(gain);
      player.loop = true;
      playersRef.current[id] = { player, gain };
    });

    return () => {
      // Cleanup all players on component unmount
      Object.values(playersRef.current).forEach(({ player }) => {
        player.stop();
        player.dispose();
      });
    };
  }, []);

  // Toggle play/pause for individual sound
  const togglePlaySound = async (id: string) => {
    try {
      await Tone.start(); // Ensure audio context is started
      const { player } = playersRef.current[id];
      if (player.state === "started") {
        player.stop();
        setPlayingStates((prev) => ({ ...prev, [id]: false }));
      } else {
        player.start();
        setPlayingStates((prev) => ({ ...prev, [id]: true }));
      }
    } catch (error) {
      console.error("Error toggling sound:", error);
      toast.error("Failed to toggle sound. Please try again.");
    }
  };

  // Toggle selection for a sound
  const toggleSelectSound = (id: string) => {
    setSelectedSounds((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
    // Set default volume to 100 if not already set
    if (!volumes[id]) {
      setVolumes((prev) => ({ ...prev, [id]: 100 }));
    }
  };

  // Update gain (volume) of a specific sound
  const updateVolume = (id: string, volume: number) => {
    try {
      const gainValue = volume / 100;
    playersRef.current[id].gain.gain.rampTo(gainValue, 1);
    setVolumes((prev) => ({ ...prev, [id]: volume }));
    } catch (error) {
      console.error("Error updating volume:", error);
      toast.error("Failed to update volume. Please try again.");
    }
  };

  // Toggle playing/stopping the entire mix
  const togglePlayMix = async () => {
   try {
    await Tone.start();
    if (isPlaying) {
      // Stop all selected sounds
      Object.entries(selectedSounds).forEach(([id, selected]) => {
        if (selected) {
          playersRef.current[id].player.stop();
          setPlayingStates((prev) => ({ ...prev, [id]: false }));
        }
      });
    } else {
      // Play all selected sounds
      Object.entries(selectedSounds).forEach(([id, selected]) => {
        if (selected) {
          playersRef.current[id].player.start();
          setPlayingStates((prev) => ({ ...prev, [id]: true }));
        }
      });
    }
    setIsPlaying(!isPlaying);
   } catch (error) {
    console.error("Error toggling mix playback:", error);
    toast.error("Failed to toggle mix playback. Please try again.");
   }
  };

  // Save or update a mix
  const addOrUpdateMix = async () => {
    const sounds = Object.entries(selectedSounds)
      .filter(([, selected]) => selected)
      .map(([id]) => ({
        id,
        volume: (volumes[id] ?? 100) / 100,
      }));

    if (!mixName.trim()) {
      toast.error("Please enter a name for your mix.");
      return;
    }

    try {
      if (isEdit) {
        await editMix(id!, mixName, sounds);
        toast.success("Mix updated successfully!");
      } else {
        await addMix(mixName, sounds);
        toast.success("Soundscape saved!");
      }
      navigate("/");
    } catch (error) {
      console.error("Error saving/updating mix:", error);
      toast.error("Failed to save the mix. Please try again.");
    }
  };

  return (
    <>
      <div className="w-full max-w-5xl mx-auto p-6">
        <input
          type="text"
          placeholder="Enter mix name"
          value={mixName}
          onChange={(e) => setMixName(e.target.value)}
          className="w-full p-3 mb-6 text-base border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        />

        <div className="grid gap-6 sm:grid-cols-1 md:grid-cols-3">
          {soundElements.map(({ id, label, icon }) => (
            <div
              key={id}
              className={`rounded-xl shadow-md p-4 transition border ${
                selectedSounds[id]
                  ? "bg-green-100 border-green-400"
                  : "bg-white hover:shadow-lg"
              }`}
            >
              <div className="flex items-center gap-4">
                <div className="relative w-14 h-14">
                  <img
                    src={icon}
                    alt={label}
                    className="w-full h-full rounded object-cover"
                  />
                  <button
                    onClick={() => togglePlaySound(id)}
                    className="absolute inset-0 flex items-center justify-center bg-black/40 rounded text-white"
                  >
                    {playingStates[id] ? (
                      <PauseCircle size={28} />
                    ) : (
                      <PlayCircle size={28} />
                    )}
                  </button>
                </div>

                <div className="flex-1">
                  <div className="text-lg font-semibold">{label}</div>
                  <div className="flex items-center gap-2 mt-2">
                    <Volume2 size={18} />
                    <input
                      type="range"
                      min="0"
                      max="100"
                      step="1"
                      value={volumes[id] ?? 100}
                      onChange={(e) => updateVolume(id, Number(e.target.value))}
                      className="w-full h-2 rounded-lg bg-slate-300 accent-blue-600 cursor-pointer"
                    />
                  </div>
                </div>
              </div>

              <button
                onClick={() => toggleSelectSound(id)}
                className={`mt-4 w-full py-1 rounded-md text-sm font-medium transition ${
                  selectedSounds[id]
                    ? "bg-red-600 hover:bg-red-700 text-white"
                    : "bg-green-600 hover:bg-green-700 text-white"
                }`}
              >
                {selectedSounds[id] ? "Remove" : "Add"}
              </button>
            </div>
          ))}
        </div>

        <div className="mt-10 flex flex-col sm:flex-row gap-10 justify-around">
          <button
            onClick={togglePlayMix}
            className="flex-1 bg-blue-600 hover:bg-blue-700 text-white text-base font-semibold py-1 px-1 rounded-lg transition"
          >
            {isPlaying ? "Stop Mix" : "Play Mix"}
          </button>

          <button
            onClick={addOrUpdateMix}
            className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white text-base font-semibold py-3 px-6 rounded-lg transition"
          >
            Save Mix
          </button>
        </div>
      </div>
      <Toaster position="top-center" />
    </>
  );
};

export default SoundElements;
