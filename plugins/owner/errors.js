const run = async (m, { bot, conn }) => {
  const errors = bot.errors();
  
  if (!errors || !errors.length) {
    return m.reply("✅ لا يوجد أي أخطاء مسجلة حتى الآن");
  }

  const res = errors.map(x => 
    `\n\n#📂 الملف: ${x.file}\n#🌱 الأمر: ${x.command}\n#❌ الايرور: ${x.error}\n==============`
  ).join("");

  m.reply(res);
};

run.command = ["الايرورات"];
run.usage = ["الايرورات"];
run.category = "owner";
run.owner = true;
export default run;
