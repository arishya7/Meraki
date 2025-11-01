# 🚀 Quick Start Guide - GPT-4 PDF Extraction

## What You Need (5 minutes setup)

1. **OpenAI API Key** (Free to start, pay-as-you-go)
2. **Python environment** (already set up)
3. **5 minutes of your time**

---

## Step-by-Step Setup

### 1️⃣ Get Your OpenAI API Key (2 minutes)

**Visit:** https://platform.openai.com/api-keys

1. Sign up or log in
2. Click **"Create new secret key"**
3. Give it a name like "Meraki-PDF-Extractor"
4. **Copy the key** (starts with `sk-...`)
5. ⚠️ **Save it somewhere safe** - you can't see it again!

💰 **Cost Info:**
- First time? You get **$5 free credits**
- Each PDF costs ~**$0.01** (1 cent)
- So you get **500 free PDFs** to test!

---

### 2️⃣ Set Up Your API Key (1 minute)

**Option A: Using .env file** (Recommended ⭐)

```bash
cd /Users/maheshwarinair/Meraki/Backend
echo "OPENAI_API_KEY=sk-your-actual-key-here" > .env
```

Replace `sk-your-actual-key-here` with your real key!

**Option B: Export in terminal**

```bash
export OPENAI_API_KEY='sk-your-actual-key-here'
```

(Note: This only lasts for current terminal session)

---

### 3️⃣ Install Dependencies (1 minute)

```bash
cd /Users/maheshwarinair/Meraki
source venv/bin/activate  # Activate your virtual environment
cd Backend
pip install -r requirements.txt
```

You should see: `Successfully installed openai-...`

---

### 4️⃣ Test It Works (1 minute)

```bash
python test_gpt4_pdf.py
```

**Expected output:**

```
🚀 Starting GPT-4 PDF Extraction Test

============================================================
Testing GPT-4 Flight Information Extraction
============================================================
...
✅ Successfully extracted flight information:
  Origin: Singapore (SIN)
  Destination: Tokyo (NRT)
  Departure Date: 2025-01-15
  Return Date: 2025-01-25
  Number of Travelers: 3
  Passenger Names: ['Mr. John Doe', 'Mrs. Jane Doe', 'Master Tommy Doe']
  ...

✅ Test PASSED - GPT-4 extraction is working!
============================================================
```

🎉 **Success!** You're ready to go!

---

## 🎯 Using the Feature

### From the Application:

1. **Start your backend:**
   ```bash
   cd /Users/maheshwarinair/Meraki/Backend
   uvicorn main:app --reload
   ```

2. **Start your frontend:**
   ```bash
   cd /Users/maheshwarinair/Meraki/frontend
   npm run dev
   ```

3. **Use the chatbot:**
   - Open your app
   - Click the chat bubble
   - Choose **"Upload booking confirmation"**
   - Select a flight booking PDF
   - ✨ Watch the magic happen!

### What Gets Extracted:

```
✈️  Origin → Destination
📅  Dates (departure & return)
👥  All passenger names
🔢  Number of travelers
🎂  Passenger ages (smart estimation)
📋  Booking reference
✈️  Flight numbers
🎫  Flexible ticket info
```

---

## ⚠️ Troubleshooting

### Problem: "OPENAI_API_KEY not found"

**Solution:**
```bash
# Check if set:
echo $OPENAI_API_KEY

# If empty, set it:
export OPENAI_API_KEY='sk-your-key'

# Or create .env file:
cd Backend
echo "OPENAI_API_KEY=sk-your-key" > .env
```

### Problem: "Failed to extract flight information"

**Possible causes:**
1. ❌ PDF is a scanned image (not text) - OCR coming soon!
2. ❌ PDF doesn't contain booking info
3. ❌ API key wrong or no credits

**Check:**
```bash
# Verify your API key works:
python test_gpt4_pdf.py

# If it works → PDF might be scanned/invalid
# If it fails → Check API key
```

### Problem: "Rate limit exceeded"

**Solution:**
- You're making requests too fast
- Wait a few seconds between uploads
- Or upgrade your OpenAI plan

### Problem: Test script works but app doesn't

**Solution:**
```bash
# Make sure .env file exists in Backend folder:
ls Backend/.env

# Check backend logs for errors:
# (in terminal where backend is running)
```

---

## 💡 Tips & Best Practices

### 1. **Supported PDF Types**
✅ Text-based PDFs (booking confirmations from airlines)
✅ Email booking confirmations saved as PDF
✅ Multi-page documents
❌ Scanned images (coming soon with OCR)
❌ Photos of boarding passes

### 2. **Testing PDFs**
Create a test PDF with:
- Flight origin and destination
- Departure and return dates
- Passenger names
- Booking reference

### 3. **Cost Management**
- Each PDF ≈ $0.01 (1 cent)
- 100 PDFs/day = $1/day = ~$30/month
- Set spending limits in OpenAI dashboard

### 4. **Best Results**
For most accurate extraction, ensure PDF contains:
- Clear dates in readable format
- Passenger names listed
- Flight details visible
- Origin and destination cities/codes

---

## 📊 What Happens Behind the Scenes

```
User uploads PDF
    ↓
Frontend sends to backend (Base64)
    ↓
Backend extracts text from PDF
    ↓
GPT-4 analyzes text intelligently
    ↓
Returns structured JSON data
    ↓
Backend validates & processes
    ↓
Frontend displays beautiful card
    ↓
User confirms and continues
```

---

## 🎓 Learn More

- **Full Documentation:** `Backend/GPT4_PDF_EXTRACTION_README.md`
- **Architecture:** `Backend/ARCHITECTURE_DIAGRAM.md`
- **OpenAI Docs:** https://platform.openai.com/docs

---

## ✅ Quick Checklist

- [ ] Got OpenAI API key
- [ ] Set OPENAI_API_KEY environment variable
- [ ] Ran `pip install -r requirements.txt`
- [ ] Ran `python test_gpt4_pdf.py` successfully
- [ ] Started backend with `uvicorn main:app --reload`
- [ ] Started frontend with `npm run dev`
- [ ] Tested PDF upload in app
- [ ] Saw extracted data displayed correctly

---

## 🆘 Need Help?

1. **Check test script:** `python Backend/test_gpt4_pdf.py`
2. **Read logs:** Look at terminal where backend is running
3. **Verify API key:** Check it on OpenAI dashboard
4. **Check credits:** Make sure you have OpenAI credits
5. **Review docs:** See `Backend/GPT4_PDF_EXTRACTION_README.md`

---

## 🎉 You're All Set!

Your app now has **enterprise-grade AI-powered PDF extraction** using GPT-4!

**What's next?**
- Upload some test PDFs
- Try different booking formats
- Monitor the logs
- Enjoy the magic! ✨

---

**Questions?** Everything is documented in the Backend folder!

**Happy extracting!** 🚀📄✨
