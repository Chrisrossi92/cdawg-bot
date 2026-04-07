export type TriviaItem = {
  question: string;
  options: [string, string, string, string];
  answer: string;
};

export const trivia: TriviaItem[] = [
  {
    question: "Which planet is known as the Red Planet?",
    options: ["Mars", "Venus", "Jupiter", "Mercury"],
    answer: "Mars",
  },
  {
    question: "What is the largest ocean on Earth?",
    options: ["Atlantic Ocean", "Indian Ocean", "Pacific Ocean", "Arctic Ocean"],
    answer: "Pacific Ocean",
  },
  {
    question: "Which animal is famous for building dams?",
    options: ["Otter", "Beaver", "Badger", "Moose"],
    answer: "Beaver",
  },
  {
    question: "How many sides does a hexagon have?",
    options: ["Five", "Six", "Seven", "Eight"],
    answer: "Six",
  },
  {
    question: "Which language is primarily spoken in Brazil?",
    options: ["Spanish", "Portuguese", "French", "Italian"],
    answer: "Portuguese",
  },
  {
    question: "What gas do plants absorb from the atmosphere?",
    options: ["Oxygen", "Nitrogen", "Carbon Dioxide", "Helium"],
    answer: "Carbon Dioxide",
  },
  {
    question: "Which chess piece can move in an L-shape?",
    options: ["Bishop", "Rook", "Knight", "Queen"],
    answer: "Knight",
  },
  {
    question: "What is the hardest natural substance commonly found on Earth?",
    options: ["Gold", "Iron", "Diamond", "Quartz"],
    answer: "Diamond",
  },
  {
    question: "Which instrument has 88 keys on a standard version?",
    options: ["Guitar", "Piano", "Violin", "Flute"],
    answer: "Piano",
  },
  {
    question: "What is the capital of Canada?",
    options: ["Toronto", "Vancouver", "Montreal", "Ottawa"],
    answer: "Ottawa",
  },
];
