from pymongo import MongoClient

client = MongoClient("mongodb+srv://samirdjunayed200_db_user:YOUR_PASSWORD@cluster0.rznywvv.mongodb.net/?appName=Cluster0")

db = client["turfconnect_dhaka"]

players = db["players"]

bookings = db["bookings"]