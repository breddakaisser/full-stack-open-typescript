import { useState } from "react";
import axios from "axios";
import { Visibility, Weather } from "../types";
import type { DiaryEntry } from "../types";
import { createDiary } from "../services/diaryService";

interface DiaryFormProps {
  onDiaryAdded: (newDiary: DiaryEntry) => void;
}

const DiaryForm = ({ onDiaryAdded }: DiaryFormProps) => {
  const [date, setDate] = useState("");
  const [visibility, setVisibility] = useState<Visibility>(Visibility.Great);
  const [weather, setWeather] = useState<Weather>(Weather.Sunny);
  const [comment, setComment] = useState("");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleSubmit = async (event: React.SyntheticEvent) => {
    event.preventDefault();
    setErrorMessage(null);

    try {
      const addedDiary = await createDiary({
        date,
        visibility,
        weather,
        comment,
      });
      onDiaryAdded(addedDiary);
      setDate("");
      setComment("");
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        const message =
          typeof error.response?.data === "string"
            ? error.response.data
            : error.message;
        setErrorMessage(message);
      } else {
        setErrorMessage("An unexpected error occurred");
      }
    }
  };

  return (
    <div>
      <h2>Add new entry</h2>
      {errorMessage && <p style={{ color: "red" }}>{errorMessage}</p>}
      <form onSubmit={handleSubmit}>
        <div>
          date{" "}
          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
          />
        </div>

        <div>
          visibility{" "}
          {Object.values(Visibility).map((v) => (
            <label key={v} style={{ marginRight: "8px" }}>
              <input
                type="radio"
                name="visibility"
                value={v}
                checked={visibility === v}
                onChange={() => setVisibility(v)}
              />
              {v}
            </label>
          ))}
        </div>

        <div>
          weather{" "}
          {Object.values(Weather).map((w) => (
            <label key={w} style={{ marginRight: "8px" }}>
              <input
                type="radio"
                name="weather"
                value={w}
                checked={weather === w}
                onChange={() => setWeather(w)}
              />
              {w}
            </label>
          ))}
        </div>

        <div>
          comment{" "}
          <input
            type="text"
            value={comment}
            onChange={(e) => setComment(e.target.value)}
          />
        </div>

        <button type="submit">add</button>
      </form>
    </div>
  );
};

export default DiaryForm;
