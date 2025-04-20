import logging
import requests
import os
from dotenv import load_dotenv
from telegram import Update, ReplyKeyboardMarkup
from telegram.ext import (
    ApplicationBuilder,
    CommandHandler,
    MessageHandler,
    ConversationHandler,
    ContextTypes,
    filters
)

# =============================
# ✅ Load environment variables
# =============================
load_dotenv()
TOKEN = os.getenv("TELEGRAM_BOT_TOKEN")

# =============================
# ✅ Logging
# =============================
logging.basicConfig(
    format="%(asctime)s - %(name)s - %(levelname)s - %(message)s", level=logging.INFO
)

# =============================
# ✅ Define States
# =============================
CHOOSING, TITLE, DESCRIPTION, LOCATION = range(4)

# =============================
# ✅ User Data Dictionary
# =============================
user_data = {}

# =============================
# ✅ /start command
# =============================
async def start(update: Update, context: ContextTypes.DEFAULT_TYPE):
    reply_keyboard = [["Register an Issue", "Update Profile", "Donate"]]
    await update.message.reply_text(
        "👋 Welcome to CareLink!\nChoose an option:",
        reply_markup=ReplyKeyboardMarkup(reply_keyboard, one_time_keyboard=True, resize_keyboard=True),
    )
    return CHOOSING

# =============================
# ✅ Handle Main Menu Choice
# =============================
async def choose_action(update: Update, context: ContextTypes.DEFAULT_TYPE):
    text = update.message.text
    user_id = update.message.from_user.id
    user_data[user_id] = {}

    if text == "Register an Issue":
        await update.message.reply_text("📝 Please enter the *title* of the issue:", parse_mode="Markdown")
        return TITLE
    elif text == "Update Profile":
        await update.message.reply_text("👤 Profile update feature coming soon!")
        return ConversationHandler.END
    elif text == "Donate":
        await update.message.reply_text("💰 Donation feature coming soon!")
        return ConversationHandler.END
    else:
        await update.message.reply_text("Please choose a valid option.")
        return CHOOSING

# =============================
# ✅ Title Handler
# =============================
async def get_title(update: Update, context: ContextTypes.DEFAULT_TYPE):
    user_id = update.message.from_user.id
    user_data[user_id]["title"] = update.message.text
    await update.message.reply_text("📝 Got it! Now enter the *description* of the issue:", parse_mode="Markdown")
    return DESCRIPTION

# =============================
# ✅ Description Handler
# =============================
async def get_description(update: Update, context: ContextTypes.DEFAULT_TYPE):
    user_id = update.message.from_user.id
    user_data[user_id]["description"] = update.message.text
    await update.message.reply_text("📍 Great! Lastly, enter the *location* of the issue:", parse_mode="Markdown")
    return LOCATION

# =============================
# ✅ Location Handler + API Call
# =============================
async def get_location(update: Update, context: ContextTypes.DEFAULT_TYPE):
    user_id = update.message.from_user.id
    user_data[user_id]["location"] = update.message.text

    data = {
        "title": user_data[user_id]["title"],
        "description": user_data[user_id]["description"],
        "location": user_data[user_id]["location"],
        "userType": "user"
    }

    try:
        response = requests.post("http://localhost:5000/report", json=data)
        if response.status_code == 201:
            await update.message.reply_text("✅ Issue registered and stored in the database successfully!")
        else:
            await update.message.reply_text("❌ Failed to register issue. Please try again later.")
    except Exception as e:
        logging.error(e)
        await update.message.reply_text("⚠️ Error connecting to the backend.")

    return ConversationHandler.END

# =============================
# ✅ Cancel Command
# =============================
async def cancel(update: Update, context: ContextTypes.DEFAULT_TYPE):
    await update.message.reply_text("❌ Operation cancelled.")
    return ConversationHandler.END

# =============================
# ✅ Bot Entry Point
# =============================
if __name__ == "__main__":
    if not TOKEN:
        raise ValueError("TELEGRAM_BOT_TOKEN not found in .env")

    app = ApplicationBuilder().token(TOKEN).build()

    conv_handler = ConversationHandler(
        entry_points=[CommandHandler("start", start)],
        states={
            CHOOSING: [MessageHandler(filters.TEXT & ~filters.COMMAND, choose_action)],
            TITLE: [MessageHandler(filters.TEXT & ~filters.COMMAND, get_title)],
            DESCRIPTION: [MessageHandler(filters.TEXT & ~filters.COMMAND, get_description)],
            LOCATION: [MessageHandler(filters.TEXT & ~filters.COMMAND, get_location)],
        },
        fallbacks=[CommandHandler("cancel", cancel)],
    )

    app.add_handler(conv_handler)
    print("🤖 CareLink Bot is running...")
    app.run_polling()