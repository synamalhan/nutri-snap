import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Camera, Cpu, BarChart3, RotateCcw } from 'lucide-react';
import UploadImage from '../components/UploadImage';
import ResultsCard from '../components/ResultsCard';
import LoadingSpinner from '../components/LoadingSpinner';
import GoalsPanel from '../components/GoalsPanel';
import MealHistory from '../components/MealHistory';
import { analyzeImage } from '../services/api';
import { AnalysisResult, Goals, MealEntry, NutritionTotal } from '../types';
import { useLocalStorage } from '../hooks/useLocalStorage';
import { DEFAULT_GOALS, todaysTotal } from '../nutrition';

const steps = [
  { icon: Camera, title: 'Upload a photo', text: 'Snap your meal or pick one from your device.', tint: 'bg-emerald-100 text-emerald-700' },
  { icon: Cpu, title: 'AI detection', text: 'A custom YOLOv8 model spots each food on the plate.', tint: 'bg-sky-100 text-sky-700' },
  { icon: BarChart3, title: 'Track your day', text: 'Tune portions, log meals and watch your daily goals fill up.', tint: 'bg-amber-100 text-amber-700' },
];

/** Small JPEG thumbnail so the meal log stays well under localStorage limits. */
const makeThumbnail = (url: string, size = 96): Promise<string | undefined> =>
  new Promise((resolve) => {
    const img = new Image();
    img.onload = () => {
      const canvas = document.createElement('canvas');
      canvas.width = canvas.height = size;
      const s = Math.min(img.width, img.height);
      canvas.getContext('2d')?.drawImage(img, (img.width - s) / 2, (img.height - s) / 2, s, s, 0, 0, size, size);
      resolve(canvas.toDataURL('image/jpeg', 0.7));
    };
    img.onerror = () => resolve(undefined);
    img.src = url;
  });

const Home: React.FC = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [mealId, setMealId] = useState<string>('');
  const [history, setHistory] = useLocalStorage<MealEntry[]>('nutrisnap-history', []);
  const [goals, setGoals] = useLocalStorage<Goals>('nutrisnap-goals', DEFAULT_GOALS);

  // Free the previous object URL whenever the image changes or the page unmounts.
  useEffect(() => () => { if (imageUrl) URL.revokeObjectURL(imageUrl); }, [imageUrl]);

  const handleImageUpload = async (file: File) => {
    setImageUrl(URL.createObjectURL(file));
    setMealId(crypto.randomUUID());
    setIsLoading(true);
    setError(null);
    setResult(null);

    try {
      setResult(await analyzeImage(file));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred during analysis');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSave = async (total: NutritionTotal, names: string[]) => {
    const existing = history.find((m) => m.id === mealId);
    const entry: MealEntry = {
      id: mealId,
      date: existing?.date ?? new Date().toISOString(),
      names,
      total,
      thumbnail: existing?.thumbnail ?? (imageUrl ? await makeThumbnail(imageUrl) : undefined),
    };
    setHistory((h) => [entry, ...h.filter((m) => m.id !== mealId)]);
  };

  const handleNewAnalysis = () => {
    setResult(null);
    setError(null);
    setImageUrl(null);
  };

  const idle = !result && !isLoading && !error;
  const isSaved = history.some((m) => m.id === mealId);

  return (
    <div className="relative overflow-hidden bg-gradient-to-b from-emerald-50/70 via-white to-white">
      {/* Soft background blobs */}
      <div aria-hidden className="pointer-events-none absolute -top-32 -left-32 h-96 w-96 rounded-full bg-emerald-200/40 blur-3xl" />
      <div aria-hidden className="pointer-events-none absolute top-20 -right-32 h-96 w-96 rounded-full bg-sky-200/40 blur-3xl" />

      <div id="upload" className="relative max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16">
        {idle && (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-10">
            <span className="inline-flex items-center gap-2 rounded-full bg-white/80 px-3 py-1 text-xs font-medium text-emerald-700 ring-1 ring-emerald-200">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" /> 43 food classes · YOLOv8
            </span>
            <h1 className="mt-5 text-4xl md:text-6xl font-extrabold tracking-tight text-gray-900">
              Know what's on your{' '}
              <span className="bg-gradient-to-r from-emerald-600 to-teal-500 bg-clip-text text-transparent">plate</span>
            </h1>
            <p className="mt-5 text-lg md:text-xl text-gray-600 max-w-2xl mx-auto">
              Upload a photo of your meal and get calories, macronutrients and a health rating in seconds.
            </p>
          </motion.div>
        )}

        {isLoading && imageUrl ? (
          <LoadingSpinner imageUrl={imageUrl} />
        ) : result ? (
          <>
            <ResultsCard
              key={mealId}
              result={result}
              imageUrl={imageUrl}
              goals={goals}
              setGoals={setGoals}
              loggedExcludingThis={todaysTotal(history.filter((m) => m.id !== mealId))}
              isSaved={isSaved}
              onSave={handleSave}
            />
            <div className="text-center mt-10">
              <button
                onClick={handleNewAnalysis}
                className="inline-flex items-center gap-2 bg-gray-900 hover:bg-gray-800 text-white px-6 py-3 rounded-xl font-medium shadow-lg shadow-gray-900/10 transition-colors"
              >
                <RotateCcw className="h-4 w-4" /> Analyze another meal
              </button>
            </div>
          </>
        ) : error ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            role="alert"
            className="max-w-xl mx-auto p-6 bg-white border border-red-200 rounded-2xl shadow-sm text-center"
          >
            {imageUrl && <img src={imageUrl} alt="Uploaded meal" className="mx-auto mb-4 h-32 w-32 rounded-xl object-cover" />}
            <h3 className="text-lg font-semibold text-red-800 mb-1">Analysis failed</h3>
            <p className="text-red-600 mb-5">{error}</p>
            <button
              onClick={handleNewAnalysis}
              className="bg-red-600 hover:bg-red-700 text-white px-6 py-2 rounded-lg font-medium transition-colors"
            >
              Try again
            </button>
          </motion.div>
        ) : (
          <UploadImage onImageUpload={handleImageUpload} />
        )}

        {!isLoading && (
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15 }}
            className={`mt-12 grid grid-cols-1 gap-6 ${idle ? 'lg:grid-cols-2' : ''}`}
          >
            {/* On the results page the goals panel already lives inside ResultsCard. */}
            {idle && <GoalsPanel goals={goals} setGoals={setGoals} logged={todaysTotal(history)} />}
            <MealHistory history={history} onDelete={(id) => setHistory((h) => h.filter((m) => m.id !== id))} />
          </motion.div>
        )}

        {idle && (
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.25 }}
            className="mt-20"
          >
            <h2 className="text-center text-2xl md:text-3xl font-bold text-gray-900 mb-10">How it works</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {steps.map(({ icon: Icon, title, text, tint }, i) => (
                <div key={title} className="relative p-6 bg-white rounded-2xl border border-gray-100 shadow-sm">
                  <span className="absolute top-5 right-6 text-5xl font-black text-gray-100 select-none">{i + 1}</span>
                  <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-4 ${tint}`}>
                    <Icon className="h-6 w-6" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-1">{title}</h3>
                  <p className="text-gray-600 text-sm">{text}</p>
                </div>
              ))}
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default Home;
