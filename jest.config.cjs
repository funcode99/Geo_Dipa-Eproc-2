const config = {
  // sudah betul, saat enable yang error di transformIgnorePatterns
  moduleDirectories: ["node_modules", "src"],
  // gak kebaca bagian yang ini (gara2 kurang / diujung nya)
  transformIgnorePatterns: [
    "/node_modules/(?!react-syntax-highlighter)/",
    "/node_modules/(?!babel-plugin-macros)/",
  ],
};

module.exports = config;