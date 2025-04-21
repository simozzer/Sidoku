class SidukoConstants {
  static HINT_BUY_BOOST_TURNS = 5;
  static INITIAL_SEEKER_LIVES = 0;

  static BOOST_UP_LEVEL_COST = 3;
  static BOOST_LIFE_COST = 3;

  static DEFAULT_FUNDS = 10;

  static GAME_DURATION_SECONDS = 500;
  static TIME_BOOST_SECONDS = 60;

  static GUESSES_MULTIPLER = 1.3;

  static INITIAL_DEFAULT_BOOST_LIVES = 1;
  static INITIAL_DEFAULT_BOOST_CELLCOUNT = 2;

  static MIN_BAD_CELLS_TO_ACTIVATE_HIGHLIGHT = 3;

  static SPAM_GUESS_PENALTY = 3; // number of guesses lost for spamming input

  static EMOJI_SET = ["☀️", "🌻", "☄️", "💫", "🎵", "♻️", "🔨", "🧸", "💎"];
  static NUM_SET = ["1", "2", "3", "4", "5", "6", "7", "8", "9"];
  static ALPHA_SET = ["A", "B", "C", "D", "E", "F", "G", "H", "I"];
  static ROMAN_SET = ["Ⅰ", "Ⅱ", "Ⅲ", "Ⅳ", "Ⅴ", "Ⅵ", "Ⅶ", "Ⅷ", "Ⅸ"];
  static COLOR_SET = ["🟠", "🟡", "🟢", "🟣", "🟤", "🟥", "🟦", "🟧", "🟨"];
  static FRACTIONS_SET = ["⅐", "⅑", "⅒", "⅓", "⅔", "⅕", "⅖", "⅗", "⅘"];
  static ARROWS_SET = ["🡸", "🡹", "🡺", "🡻", "🡼", "🡽", "🡾", "🡿", "*"];
  static NUMBER_CIRCLES_SET = ["①", "②", "③", "④", "⑤", "⑥", "⑦", "⑧", "⑨"];
  static BRAILLE_SET = ["⠁", "⠂", "⠃", "⠄", "⠅", "⠆", "⠇", "⠈", "⠉"];
  static COMMON_LETTERS_SET = ["E", "T", "A", "O", "I", "N", "S", "R", "H"];

  INTFSKUHC
  
  static RUDE_SET = ["I", "N", "T", "F", "S", "K", "U", "H", "C"]; // POINTS FOR SUCK, SICK, FUCK, CUNT, SHIT, SHIN, THIS, HISS, CHIN, FIST,
  // KIT, SIT,HIT, FIT,FUN, FIN, HIS,
  static RUDE_SET_WORD_LIST = ["funk","hick","hunk","nick","suck","tuck","husk","sick","tick","chin","inch","such","sunk","fish","inks","itch","knit","sink","skin","tusk","cuts","fins","huns","hunt","kits","shun","skit","cist","fist","fits","hint","huts","shin","shut","sift","thin","thus","tics","hist","hits","nuts","shit","stun","this","unit","nits","suit","tins"];

  static ALL_CHARSETS = [
    SidukoConstants.EMOJI_SET,
    SidukoConstants.NUM_SET,
    SidukoConstants.ALPHA_SET,
    SidukoConstants.ROMAN_SET,
    SidukoConstants.COLOR_SET,
    SidukoConstants.FRACTIONS_SET,
    SidukoConstants.ARROWS_SET,
    SidukoConstants.NUMBER_CIRCLES_SET,
    SidukoConstants.BRAILLE_SET,

    SidukoConstants.RUDE_SET,
    
  ];

  static CHAR_CLOCK = "⌚";
  static CHAR_ROW = "⏩";
  static CHAR_COLUMN = "⏬";
  static CHAR_INNER_TABLE = "🞖";
  static CHAR_SEEKER = "🍭";
  static CHAR_ERASE_BAD = "⌫";
  static CHAR_HINT = "ⓘ";
  static CHAR_RANDOM_VALUE = "🎲";
  static CHAR_RANDOM_CELL = "❔";
  static CHAR_HIGHLIGHT_BAD = "❕";

  static CHAR_BASEBALL = "⚾"; // HOME RUN (IF ALL REMAINING CELLS HAVE 1 VALUE FILL THEM)
  static CHAR_BOMB = "💣"; // FOR THE NEXT TURN ANY CORRECT VALUE REVEALED WILL AUTO FILL ADJACENT CELLS
  static CHAR_LOCK = "🔒"; // AUTO LOCK ANY CORRECTLY ENTERED VALUES
  static CHAR_LINK = "🔗"; // AUTO UPDATE ASSOCIATED VALUES
  static CHAR_BOOM = "💥"; // BAD!! WIPE A RANDOM NUMBER OF CELLS.
  static CHAR_CASH = "💲"; // ADD AN AMOUNT TO EACH BONUS
  static CHAR_COMPUTER = "💻"; // EARN FULL BONUS WHEN USING BOOSTS
  static CHAR_ROCKET = "🚀"; // COMPLTE THE CURRENT PUZZLE (WITH NO BONUS).

  static QUICK_STREAK_TIMEOUT = 5000; // number of ms to wait between entries before timeout for a streak

}
