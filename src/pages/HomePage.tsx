"use client";

import { useNavigate } from "react-router-dom";
import useUserStore from "../store/userStore";
import firstMix from "/uploads/firstmix.webp";
import { useEffect, useRef, useState } from "react";
import { deleteMix, getAllSavedMix } from "../api/soundscapeApi";
import { savedMix } from "../interface/soundType";
import { PauseCircle, PlayCircle, Trash2 } from "lucide-react";
import * as Tone from "tone";
import { soundElements } from "../sounds/files";
import { Toaster, toast } from "sonner";
import Logout from "../components/Logout";

const HomePage = () => {
  const navigate = useNavigate();
  const { user } = useUserStore();

  const [isFirstMix, setIsFirstMix] = useState(false); // true if user has no mixes
  const [savedMixes, setSavedMixes] = useState<savedMix[]>([]); // user’s saved mixes
  const [currentlyPlayingMixId, setCurrentlyPlayingMixId] = useState<
    string | null
  >(null); // id of mix that is playing

  const playersRef = useRef<Record<string, Tone.Player>>({}); // all audio players
  const playerStatusRef = useRef<Record<string, boolean>>({}); // which players are active

  //logoutModal
  const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false);

  //for delete states
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [selectedMixId, setSelectedMixId] = useState<string | null>(null);

  const openDeleteModal = (mixId: string) => {
    setSelectedMixId(mixId);
    setDeleteModalOpen(true);
  };

  const closeDeleteModal = () => {
    setSelectedMixId(null);
    setDeleteModalOpen(false);
  };

  useEffect(() => {
    // fetch all saved mixes
    const fetchAllSavedMixes = async () => {
      try {
        const res = await getAllSavedMix();

        if (res?.data.length > 0) {
          setIsFirstMix(false);
          setSavedMixes(res?.data);
        } else {
          setIsFirstMix(true);
        }
      } catch (error) {
        console.error("❌ Error fetching saved mixes:", error);
        toast.error("Failed to load your mixes. Please try again later.");
      }
    };

    fetchAllSavedMixes();

    return () => {
      cleanupAllPlayers();
    };
  }, []);

  //stop and remove all players
  const cleanupAllPlayers = () => {
    Object.entries(playersRef.current).forEach(([id, player]) => {
      if (playerStatusRef.current[id]) {
        try {
          player.stop(); // stop if playing
        } catch (e) {
          console.log(`Error stopping player ${id}:`, e);
        }
      }

      try {
        player.dispose(); // release memory
      } catch (e) {
        console.log(`Error disposing player ${id}:`, e);
      }
    });

    //clear
    playersRef.current = {};
    playerStatusRef.current = {};
    setCurrentlyPlayingMixId(null);
  };

  //to stop currently playing sounds
  const stopAllSounds = () => {
    Object.entries(playersRef.current).forEach(([id, player]) => {
      if (playerStatusRef.current[id]) {
        try {
          player.stop();
          playerStatusRef.current[id] = false;
        } catch (e) {
          console.log(`Error stopping player ${id}:`, e);
        }
      }
    });

    setCurrentlyPlayingMixId(null);
  };

  // convert volume to value between 0 and 1
  const normalizeVolume = (vol: number | undefined) => {
    if (vol === undefined) return 0;
    return Math.max(0, Math.min(1, vol));
  };

  // play a selected mix
  const playMix = async (mix: savedMix) => {
    if (currentlyPlayingMixId === mix._id) {
      stopAllSounds();
      return;
    }

    cleanupAllPlayers();

    await Tone.start().catch((err) => {
      console.error("Error starting Tone.js:", err);
      return;
    });

    const newPlayers: Record<string, Tone.Player> = {};
    const newPlayerStatus: Record<string, boolean> = {};

    // create and start a player for each sound
    mix.sounds.forEach((sound) => {
      const match = soundElements.find((element) => element.id === sound.id);
      if (!match) return;

      try {
        const normalizedVolume = normalizeVolume(sound.volume);
        const volumeInDb = Tone.gainToDb(normalizedVolume);

        const player = new Tone.Player({
          url: match.url,
          loop: true,
          playbackRate: 1.0,
          onload: () => {
            try {
              player.start();
              newPlayerStatus[sound.id] = true;
            } catch (e) {
              console.error(`Error starting player ${sound.id}:`, e);
            }
          },
          onerror: (err) => {
            console.error(`Error loading sound ${sound.id}:`, err);
          },
        }).toDestination();

        player.volume.value = volumeInDb;

        newPlayers[sound.id] = player;
        newPlayerStatus[sound.id] = false;
      } catch (e) {
        console.error(`Error creating player for ${sound.id}:`, e);
      }
    });

    // save players in memory
    playersRef.current = newPlayers;
    playerStatusRef.current = newPlayerStatus;
    setCurrentlyPlayingMixId(mix._id || null);
  };

  const openLogoutModal = () => setIsLogoutModalOpen(true);
  const closeLogoutModal = () => setIsLogoutModalOpen(false);

  //handle delete
  const handleDeleteMix = async () => {
    if (!selectedMixId) return;

    try {
      await deleteMix(selectedMixId);
      toast.success("Mix deleted successfully.");
      setSavedMixes((prev) => prev.filter((mix) => mix._id !== selectedMixId));
    } catch (error) {
      console.error("❌ Error deleting mix:", error);
      toast.error("Failed to delete mix.");
    } finally {
      closeDeleteModal();
    }
  };

  return (
    <div className="min-h-screen flex-col">
      <div className="flex items-center justify-between px-6 py-3 bg-slate-300">
        <h1 className="font-bold text-3xl">CITY SOUNDSCAPE</h1>
        <div
          className="bg-slate-500 px-2 rounded-lg text-white cursor-pointer"
          onClick={openLogoutModal}
        >
          <p>{user?.username.toUpperCase()}</p>
        </div>
      </div>

      {isFirstMix ? (
        <div className="flex justify-around">
          <div className="flex flex-col justify-center items-center text-center space-y-10 min-h-[70vh]">
            <h1 className="font-semibold text-5xl">
              Ready for your first mix??
            </h1>
            <button
              className="bg-slate-600 text-white px-3 py-1 rounded-lg"
              onClick={() => navigate("/mix")}
            >
              Start Mix
            </button>
          </div>

          <div>
            <img
              src={firstMix}
              alt="First mix"
              className="w-full max-w-md mx-auto mt-4"
            />
          </div>
        </div>
      ) : (
        <>
          <div className="flex flex-row-reverse px-3 py-3">
            <button
              className="bg-slate-600 text-white px-3 py-1 rounded-lg"
              onClick={() => navigate("/mix")}
            >
              Add New Mix
            </button>
          </div>

          <div className="p-6 space-y-6">
            <h2 className="text-2xl font-bold">Your Saved Mixes</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {savedMixes.map((mix, index) => (
                <div
                  key={mix._id || index}
                  className="border rounded-lg shadow-md p-4 flex flex-col justify-between bg-white"
                >
                  <div className="flex justify-between">
                    <div>
                      <h3 className="text-xl font-semibold mb-2">
                        {mix.name.charAt(0).toUpperCase() + mix.name.slice(1)}
                      </h3>
                      <p className="text-gray-600 mb-4">
                        Sounds: {mix.sounds?.length || 0}
                      </p>
                    </div>
                    <button onClick={() => playMix(mix)}>
                      {currentlyPlayingMixId === mix._id ? (
                        <PauseCircle size={24} />
                      ) : (
                        <PlayCircle size={24} />
                      )}
                    </button>

                    <button
                      onClick={() => openDeleteModal(mix._id!)}
                      className="text-red-500 hover:text-red-700"
                    >
                      <Trash2 size={20} />
                    </button>
                  </div>

                  <button
                    onClick={() => navigate(`/mix/${mix._id}`)}
                    className="mt-auto bg-slate-600 text-white px-3 py-1 rounded"
                  >
                    Open Mix
                  </button>
                </div>
              ))}
            </div>
          </div>
        </>
      )}
      {deleteModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg max-w-sm w-full text-center space-y-4">
            <h2 className="text-xl font-semibold">Confirm Deletion</h2>
            <p>Are you sure you want to delete this mix?</p>
            <div className="flex justify-end gap-4 mt-4">
              <button
                className="bg-gray-300 px-3 py-1 rounded hover:bg-gray-400"
                onClick={closeDeleteModal}
              >
                Cancel
              </button>
              <button
                className="bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700"
                onClick={handleDeleteMix}
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

      <Toaster position="top-center" />
      <Logout open={isLogoutModalOpen} onClose={closeLogoutModal} />
    </div>
  );
};

export default HomePage;
