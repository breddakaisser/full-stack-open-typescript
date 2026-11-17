import type { CoursePart } from "../types";

interface PartProps {
  part: CoursePart;
}

const assertNever = (value: never): never => {
  throw new Error(
    `Unhandled discriminated union member: ${JSON.stringify(value)}`
  );
};

const Part = ({ part }: PartProps) => {
  switch (part.kind) {
    case "basic":
      return (
        <div>
          <p>
            <strong>
              {part.name} {part.exerciseCount}
            </strong>
            <br />
            <em>{part.description}</em>
          </p>
        </div>
      );
    case "group":
      return (
        <div>
          <p>
            <strong>
              {part.name} {part.exerciseCount}
            </strong>
            <br />
            project exercises {part.groupProjectCount}
          </p>
        </div>
      );
    case "background":
      return (
        <div>
          <p>
            <strong>
              {part.name} {part.exerciseCount}
            </strong>
            <br />
            <em>{part.description}</em>
            <br />
            submit to {part.backgroundMaterial}
          </p>
        </div>
      );
    case "special":
      return (
        <div>
          <p>
            <strong>
              {part.name} {part.exerciseCount}
            </strong>
            <br />
            <em>{part.description}</em>
            <br />
            required skills: {part.requirements.join(", ")}
          </p>
        </div>
      );
    default:
      return assertNever(part);
  }
};

export default Part;
