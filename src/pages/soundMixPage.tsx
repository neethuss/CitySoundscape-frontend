import SoundElements from "../components/SoundElements";

const SoundMixPage = () => {
  return (
    <div className="min-h-screen h-screen flex flex-col items-center">
      <div
        className="relative w-full h-40 bg-cover bg-center"
        style={{ backgroundImage: `url('/uploads/mix.jpg')` }}
      >
        <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-30">
          <h1 className="text-white text-3xl font-bold">Mix Your Own Sounds</h1>
        </div>
      </div>
      <SoundElements />
    </div>
  );
};

export default SoundMixPage;
