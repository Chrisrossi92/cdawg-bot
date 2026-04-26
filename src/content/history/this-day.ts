export type ThisDayInHistoryEvent = {
  id: string;
  monthDay: string;
  year: number;
  title: string;
  summary: string;
  impact: string;
  link: string;
};

export const thisDayInHistoryByDate: Record<string, readonly ThisDayInHistoryEvent[]> = {
  "01-01": [
    {
      id: "1707-union-of-england-scotland",
      monthDay: "01-01",
      year: 1707,
      title: "The Acts of Union take effect, creating the Kingdom of Great Britain",
      summary:
        "England and Scotland were formally united under a single parliament, reshaping the political map of the British Isles.",
      impact:
        "The union laid the foundation for Britain’s later global influence and remains central to debates about identity, sovereignty, and devolution.",
      link: "https://en.wikipedia.org/wiki/Acts_of_Union_1707",
    },
    {
      id: "1863-emancipation-proclamation",
      monthDay: "01-01",
      year: 1863,
      title: "The Emancipation Proclamation goes into effect",
      summary:
        "President Abraham Lincoln’s order declared enslaved people in Confederate-held territory to be free during the American Civil War.",
      impact:
        "It transformed the war’s meaning, tied Union victory to emancipation, and helped pave the way for the 13th Amendment.",
      link: "https://en.wikipedia.org/wiki/Emancipation_Proclamation",
    },
  ],
  "02-15": [
    {
      id: "1898-uss-maine-explosion",
      monthDay: "02-15",
      year: 1898,
      title: "The USS Maine explodes in Havana Harbor",
      summary:
        "The American battleship was destroyed in Cuba, killing more than 250 sailors and igniting a political firestorm in the United States.",
      impact:
        "The disaster helped push the U.S. toward the Spanish-American War and showed how media pressure can accelerate international conflict.",
      link: "https://en.wikipedia.org/wiki/USS_Maine_(1889)",
    },
    {
      id: "1564-galileo-born",
      monthDay: "02-15",
      year: 1564,
      title: "Galileo Galilei is born",
      summary:
        "The Italian astronomer and physicist who would later challenge accepted ideas about the cosmos was born in Pisa.",
      impact:
        "Galileo became a symbol of scientific inquiry, evidence-based reasoning, and the tension between new knowledge and entrenched authority.",
      link: "https://en.wikipedia.org/wiki/Galileo_Galilei",
    },
  ],
  "03-15": [
    {
      id: "44bc-caesar-assassinated",
      monthDay: "03-15",
      year: -44,
      title: "Julius Caesar is assassinated on the Ides of March",
      summary:
        "A group of Roman senators killed Caesar in the Theater of Pompey, hoping to stop his rise to unchecked power.",
      impact:
        "Instead of restoring the republic, the assassination accelerated its collapse and cleared the way for the Roman Empire.",
      link: "https://en.wikipedia.org/wiki/Assassination_of_Julius_Caesar",
    },
    {
      id: "1939-germany-occupies-prague",
      monthDay: "03-15",
      year: 1939,
      title: "Nazi Germany occupies Prague",
      summary:
        "German forces entered Prague and completed the dismantling of what remained of Czechoslovakia.",
      impact:
        "The occupation exposed the failure of appeasement and signaled that Hitler’s expansion would not stop with previous concessions.",
      link: "https://en.wikipedia.org/wiki/German_occupation_of_Czechoslovakia",
    },
  ],
  "04-12": [
    {
      id: "1861-fort-sumter",
      monthDay: "04-12",
      year: 1861,
      title: "Confederate forces open fire on Fort Sumter",
      summary:
        "The bombardment of the Union fort in Charleston Harbor marked the beginning of open warfare in the American Civil War.",
      impact:
        "It turned political crisis into full-scale war and set the United States on a path through four years of devastating conflict.",
      link: "https://en.wikipedia.org/wiki/Battle_of_Fort_Sumter",
    },
    {
      id: "1961-gagarin-spaceflight",
      monthDay: "04-12",
      year: 1961,
      title: "Yuri Gagarin becomes the first human in space",
      summary:
        "The Soviet cosmonaut completed a single orbit aboard Vostok 1 and instantly became a global symbol of the Space Race.",
      impact:
        "His flight proved human space travel was possible and intensified the Cold War competition that drove rapid advances in science and engineering.",
      link: "https://en.wikipedia.org/wiki/Yuri_Gagarin",
    },
  ],
  "04-17": [
    {
      id: "1961-bay-of-pigs-invasion",
      monthDay: "04-17",
      year: 1961,
      title: "The Bay of Pigs invasion begins in Cuba",
      summary:
        "A U.S.-backed force of Cuban exiles landed in Cuba in an attempt to overthrow Fidel Castro’s government, but the operation quickly unraveled.",
      impact:
        "The failure strengthened Castro, embarrassed the Kennedy administration, and deepened Cold War tensions in the Western Hemisphere.",
      link: "https://en.wikipedia.org/wiki/Bay_of_Pigs_Invasion",
    },
    {
      id: "1790-franklin-death",
      monthDay: "04-17",
      year: 1790,
      title: "Benjamin Franklin dies in Philadelphia",
      summary:
        "Franklin, one of the most influential founders of the United States, died at age 84 after a career spanning science, diplomacy, and politics.",
      impact:
        "His legacy shaped the American founding and left a model of civic curiosity that still defines how many people imagine the Enlightenment era.",
      link: "https://en.wikipedia.org/wiki/Benjamin_Franklin",
    },
  ],
  "05-08": [
    {
      id: "1945-ve-day",
      monthDay: "05-08",
      year: 1945,
      title: "Victory in Europe Day is declared",
      summary:
        "Nazi Germany’s unconditional surrender was celebrated across Allied countries as the war in Europe came to an end.",
      impact:
        "VE Day marked the collapse of Hitler’s regime, but it also underscored that World War II would continue in the Pacific for several more months.",
      link: "https://en.wikipedia.org/wiki/Victory_in_Europe_Day",
    },
    {
      id: "1886-coca-cola-first-sold",
      monthDay: "05-08",
      year: 1886,
      title: "Coca-Cola is first sold in Atlanta",
      summary:
        "Dr. John Stith Pemberton’s new beverage went on sale at Jacobs’ Pharmacy as a soda fountain drink.",
      impact:
        "What began as a local tonic became one of the world’s most recognizable consumer brands, reflecting the rise of modern mass marketing.",
      link: "https://en.wikipedia.org/wiki/Coca-Cola",
    },
  ],
  "06-06": [
    {
      id: "1944-d-day-landings",
      monthDay: "06-06",
      year: 1944,
      title: "Allied forces land in Normandy on D-Day",
      summary:
        "Troops from the United States, United Kingdom, Canada, and other Allied nations launched a massive amphibious assault on German-occupied France.",
      impact:
        "The landings opened a Western front against Nazi Germany and became one of the most consequential military operations of the 20th century.",
      link: "https://en.wikipedia.org/wiki/Normandy_landings",
    },
    {
      id: "1844-young-mens-christian-association-founded",
      monthDay: "06-06",
      year: 1844,
      title: "The YMCA is founded in London",
      summary:
        "George Williams established the Young Men’s Christian Association to support young workers moving into the city.",
      impact:
        "The YMCA became a major international social movement, showing how civic and religious organizations shaped urban life in the industrial era.",
      link: "https://en.wikipedia.org/wiki/YMCA",
    },
  ],
  "07-20": [
    {
      id: "1969-apollo-11-moon-landing",
      monthDay: "07-20",
      year: 1969,
      title: "Apollo 11 lands on the Moon",
      summary:
        "Neil Armstrong and Buzz Aldrin landed the lunar module Eagle, while Michael Collins remained in orbit aboard the command module.",
      impact:
        "The landing represented a defining achievement of the Space Race and demonstrated the scale of technological ambition possible during the Cold War.",
      link: "https://en.wikipedia.org/wiki/Apollo_11",
    },
    {
      id: "1944-july-plot",
      monthDay: "07-20",
      year: 1944,
      title: "The July 20 plot attempts to assassinate Adolf Hitler",
      summary:
        "A bomb planted by Claus von Stauffenberg exploded at Hitler’s headquarters, but Hitler survived and the coup failed.",
      impact:
        "The plot remains one of the clearest examples of internal German resistance to Nazism, and its failure led to brutal reprisals.",
      link: "https://en.wikipedia.org/wiki/20_July_plot",
    },
  ],
  "08-28": [
    {
      id: "1963-march-on-washington",
      monthDay: "08-28",
      year: 1963,
      title: "The March on Washington takes place",
      summary:
        "Hundreds of thousands gathered in Washington, D.C., where Martin Luther King Jr. delivered his “I Have a Dream” speech.",
      impact:
        "The march became a defining moment of the civil rights movement and helped build support for landmark federal civil rights legislation.",
      link: "https://en.wikipedia.org/wiki/March_on_Washington_for_Jobs_and_Freedom",
    },
    {
      id: "1833-british-slavery-abolition-act",
      monthDay: "08-28",
      year: 1833,
      title: "Britain passes the Slavery Abolition Act",
      summary:
        "The act set in motion the abolition of slavery across most of the British Empire, though not without compromises and delays.",
      impact:
        "It marked a major legal turning point in the global fight against slavery while also revealing how emancipation was often shaped by economic and political bargaining.",
      link: "https://en.wikipedia.org/wiki/Slavery_Abolition_Act_1833",
    },
  ],
  "09-02": [
    {
      id: "1945-japan-surrenders",
      monthDay: "09-02",
      year: 1945,
      title: "Japan formally surrenders, ending World War II",
      summary:
        "Representatives of Japan signed the instrument of surrender aboard USS Missouri in Tokyo Bay.",
      impact:
        "The ceremony formally closed World War II and opened the door to a new international order shaped by the United States, the Soviet Union, and the United Nations.",
      link: "https://en.wikipedia.org/wiki/Surrender_of_Japan",
    },
    {
      id: "1666-great-fire-london-begins",
      monthDay: "09-02",
      year: 1666,
      title: "The Great Fire of London begins",
      summary:
        "A fire starting in a bakery on Pudding Lane spread rapidly through the wooden buildings of London.",
      impact:
        "The disaster transformed the city’s physical layout, building standards, and ideas about urban planning and public safety.",
      link: "https://en.wikipedia.org/wiki/Great_Fire_of_London",
    },
  ],
  "10-14": [
    {
      id: "1066-battle-of-hastings",
      monthDay: "10-14",
      year: 1066,
      title: "William the Conqueror wins the Battle of Hastings",
      summary:
        "Norman forces defeated King Harold II, beginning the Norman conquest of England.",
      impact:
        "The victory reshaped English rule, landholding, and language, with effects that still echo in law, politics, and vocabulary.",
      link: "https://en.wikipedia.org/wiki/Battle_of_Hastings",
    },
    {
      id: "1962-cuban-missile-crisis-photos",
      monthDay: "10-14",
      year: 1962,
      title: "U.S. reconnaissance photographs Soviet missiles in Cuba",
      summary:
        "American spy plane imagery revealed Soviet missile installations in Cuba, triggering the Cuban Missile Crisis.",
      impact:
        "The discovery brought the world to the brink of nuclear war and became a defining case study in deterrence, intelligence, and crisis management.",
      link: "https://en.wikipedia.org/wiki/Cuban_Missile_Crisis",
    },
  ],
  "11-09": [
    {
      id: "1989-berlin-wall-opens",
      monthDay: "11-09",
      year: 1989,
      title: "The Berlin Wall opens",
      summary:
        "Confusion over new travel rules prompted East Berliners to gather at checkpoints, where guards eventually allowed them to cross.",
      impact:
        "The opening became the iconic symbol of the Cold War’s collapse in Europe and pointed toward German reunification.",
      link: "https://en.wikipedia.org/wiki/Berlin_Wall",
    },
    {
      id: "1799-napoleon-coup-18-brumaire",
      monthDay: "11-09",
      year: 1799,
      title: "Napoleon launches the coup of 18 Brumaire",
      summary:
        "Napoleon Bonaparte overthrew the French Directory and seized power, ending one phase of the French Revolution.",
      impact:
        "The coup cleared the path for Napoleon’s rule and showed how revolutionary instability can open the door to authoritarian consolidation.",
      link: "https://en.wikipedia.org/wiki/Coup_of_18_Brumaire",
    },
  ],
  "12-25": [
    {
      id: "800-charlemagne-crowned",
      monthDay: "12-25",
      year: 800,
      title: "Charlemagne is crowned emperor in Rome",
      summary:
        "Pope Leo III crowned Charlemagne emperor on Christmas Day, symbolically reviving imperial rule in Western Europe.",
      impact:
        "The coronation helped shape medieval European ideas about kingship, empire, and the relationship between church and state.",
      link: "https://en.wikipedia.org/wiki/Charlemagne",
    },
    {
      id: "1991-gorbachev-resigns",
      monthDay: "12-25",
      year: 1991,
      title: "Mikhail Gorbachev resigns, signaling the end of the Soviet Union",
      summary:
        "Gorbachev stepped down as president of the USSR as the Soviet system formally unraveled.",
      impact:
        "His resignation marked the end of one of the 20th century’s two superpowers and reset global politics for the post-Cold War era.",
      link: "https://en.wikipedia.org/wiki/Dissolution_of_the_Soviet_Union",
    },
  ],
};
