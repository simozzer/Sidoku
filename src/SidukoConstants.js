class SidukoConstants {
  static HINT_BUY_BOOST_TURNS = 4;
  static INITIAL_SEEKER_LIVES = 0;

  static BOOST_UP_LEVEL_COST = 3;
  static BOOST_LIFE_COST = 3;

  static DEFAULT_FUNDS = 5;

  static GAME_DURATION_SECONDS = 500;
  static TIME_BOOST_SECONDS = 60;

  static GUESSES_MULTIPLER = 1.3;

  static INITIAL_DEFAULT_BOOST_LIVES = 0;
  static INITIAL_DEFAULT_BOOST_CELLCOUNT = 2;

  static MIN_BAD_CELLS_TO_ACTIVATE_HIGHLIGHT = 3;

  static SPAM_GUESS_PENALTY = 2; // number of guesses lost for spamming input

  static EMOJI_SET = ["☀️", "🌻", "☄️", "💫", "🎵", "♻️", "🔨", "🧸", "💎"];
  static NUM_SET = ["1", "2", "3", "4", "5", "6", "7", "8", "9"];
  static ALPHA_SET = ["A", "B", "C", "D", "E", "F", "G", "H", "I"];
  static ROMAN_SET = ["Ⅰ", "Ⅱ", "Ⅲ", "Ⅳ", "Ⅴ", "Ⅵ", "Ⅶ", "Ⅷ", "Ⅸ"];
  static COLOR_SET = ["🟠", "🟡", "🟢", "🟣", "🟤", "🟥", "🟦", "🟧", "🟨"];
  static FRACTIONS_SET = ["⅐", "⅑", "⅒", "⅓", "⅔", "⅕", "⅖", "⅗", "⅘"];
  static ARROWS_SET = ["🡸", "🡹", "🡺", "🡻", "🡼", "🡽", "🡾", "🡿", "*"];
  static NUMBER_CIRCLES_SET = ["①", "②", "③", "④", "⑤", "⑥", "⑦", "⑧", "⑨"];
  static BRAILLE_SET = ["⠼⠁", "⠼⠃", "⠼⠉", "⠼⠙", "⠼⠑", "⠼⠋", "⠼⠛", "⠼⠐", "⠼⠓"];
  static RUDE_SET = ["C", "N", "T", "F", "U", "K", "S", "H", "I"]; // POINTS FOR SICK, FUCK, CUNT, SHIT,  SHIN,  THIS,  HISS, CHIN, FIST,
  // KIT, SIT,HIT, FIT,FUN, FIN, HIS,
  static ALL_CHARSETS = [
    SidukoConstants.EMOJI_SET,
    SidukoConstants.NUM_SET,
    SidukoConstants.ALPHA_SET,
    SidukoConstants.ROMAN_SET,
    SidukoConstants.COLOR_SET,
    SidukoConstants.FRACTIONS_SET,
    SidukoConstants.ARROWS_SET,
    SidukoConstants.NUMBER_CIRCLES,
    SidukoConstants.BRAILLE_SET,

    SidukoConstants.RUDE_SET,
    
  ];

}
