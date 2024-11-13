import {
  Box,
  IconButton,
  TextField,
  Typography,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from "@mui/material";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  collection,
  getDocs,
  query,
  addDoc,
  updateDoc,
  doc,
  getDoc,
  serverTimestamp,
} from "firebase/firestore";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { db, auth } from "../../firebase/firebase"; // Import auth to get the logged-in user

const Recharge = () => {
  const [rechargeData, setRechargeData] = useState([]);
  const [amount, setAmount] = useState("");
  const [openPopup, setOpenPopup] = useState(false);
  const [name, setName] = useState("");
  const [authUser, setAuthUser] = useState([]);
  const [status, setStatus] = useState("Pending");

  const navigate = useNavigate();

  const getData = async () => {
    try {
      const q = query(collection(db, "recharge"));
      const querySnapshot = await getDocs(q);
      const rechargeItems = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));

      const currentUserId = auth.currentUser.uid;
      const userRechargeItems = rechargeItems.filter(
        (item) => item.userId === currentUserId
      );
      setRechargeData(userRechargeItems);
    } catch (error) {
      console.error("Error fetching recharge data: ", error);
    }
  };

  const handleRecharge = async () => {
    if (amount < 500) {
      alert("Recharge amount must be at least ₹500");
      return;
    }

    // Open the confirmation popup
    setOpenPopup(true);
  };
  const authUserData = async () => {
    try {
      const q = query(collection(db, "users"));
      const querySnapshot = await getDocs(q);
      const rechargeItems = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(), 
      }));
      const currentUserId = auth.currentUser?.email;
      const authUsersItem = rechargeItems.find(
        (item) => item.email === currentUserId
      );
      setAuthUser(authUsersItem);
    } catch (error) {
      console.error("Error fetching recharge data: ", error);
    }
  };
  const handleConfirmRecharge = async () => {
    try {
      const currentUser = auth.currentUser;

      // Add the recharge record to Firestore
      const newRecharge = {
        name,
        email: currentUser.email,
        createdAt: serverTimestamp(),
        status: "Success", // Set status logic here
        amount: Number(amount),
        userId: currentUser.uid, // Store the user ID to associate with the user
      };
      await addDoc(collection(db, "recharge"), newRecharge);
      const userRef = doc(db, "users", currentUser.uid);
      const userDoc = await getDoc(userRef);
      if (userDoc.exists()) {
        const userData = userDoc.data();
        const newBalance = userData.amount + Number(amount);
        await updateDoc(userRef, {
          amount: newBalance,
        });
      }

      // Close the popup and reset the form
      setOpenPopup(false);
      setAmount(""); // Clear the amount field after recharge
      setName("");
      setStatus("Pending");

      // Fetch the updated data after recharge
      getData();
    } catch (error) {
      console.error("Error making recharge: ", error);
    }
  };

  useEffect(() => {
    getData();
    authUserData()
  }, []);

  return (
    <Box sx={{ width: "100%", height: "100vh" }}>
      <Box sx={{ p: 1, background: "#EBA834" }}>
        <Box sx={{ display: "flex", gap: "10px", alignItems: "center" }}>
          <IconButton onClick={() => navigate(-1)}>
            <ArrowBackIcon sx={{ color: "white" }} />
          </IconButton>
          <Typography
            sx={{ fontSize: "18px", color: "white", fontWeight: "600" }}
          >
            Back to profile
          </Typography>
        </Box>
      </Box>

      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        <Typography
          sx={{ fontSize: "30px", fontWeight: "600", my: 2, color: "#EBA834" }}
        >
          Recharge
        </Typography>
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <Typography
            sx={{ color: "#EBA834", fontSize: "16px", fontWeight: "500" }}
          >
            <span style={{ fontWeight: "500", fontSize: "18px" }}>
              My Balance:{" "}
            </span>
            ₹ {authUser?.amount?.toFixed(2)}
          </Typography>
        </Box>
      </Box>

      <Box
        sx={{ width: "100%", display: "flex", justifyContent: "center", mt: 2 }}
      >
        <TextField
          type="number"
          placeholder="Enter Recharge Amount"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          sx={{
            ".MuiOutlinedInput-input": {
              p: 1,
              outline: "none",
              border: "none",
            },
          }}
        />
        <Button variant="contained" onClick={handleRecharge} sx={{ ml: 2 }}>
          Recharge
        </Button>
      </Box>

      {/* Confirmation Popup */}
      <Dialog open={openPopup} onClose={() => setOpenPopup(false)}>
        <DialogTitle>Confirm Recharge</DialogTitle>
        <DialogContent>
          <TextField
            label="Name"
            fullWidth
            required
            value={name}
            onChange={(e) => setName(e.target.value)}
            sx={{ my: 1 }}
          />
          <TextField
            label="Email"
            fullWidth
            disabled
            value={auth.currentUser.email}
            sx={{ my: 1 }}
          />
          <Typography variant="body2">Recharge Amount: ₹{amount}</Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleConfirmRecharge}>Confirm</Button>
          <Button onClick={() => setOpenPopup(false)}>Cancel</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default Recharge;
