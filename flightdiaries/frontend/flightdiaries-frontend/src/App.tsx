import { useEffect, useState } from "react";
import type { DiaryEntry } from "./types";
import { getAllDiaries } from "./services/diaryService";
import DiaryForm from "./components/DiaryForm";
import DiaryList from "./components/DiaryList";

const App = () => {
  const [diaries, setDiaries] = useState<DiaryEntry[]>([]);

  useEffect(() => {
    getAllDiaries().then((data) => {
      setDiaries(data);
    });
  }, []);

  const addDiary = (newDiary: DiaryEntry) => {
    setDiaries((prev) => prev.concat(newDiary));
  };

  return (
    <div>
      <DiaryForm onDiaryAdded={addDiary} />
      <DiaryList diaries={diaries} />
    </div>
  );
};

export default App;

