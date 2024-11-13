import {
  Box,
  Button,
  IconButton,
  MenuItem,
  TextField,
  Typography,
} from "@mui/material";
import React, { useEffect, useState } from "react";
import {
  collection,
  getDocs,
  query,
  addDoc,
  serverTimestamp,
  doc,
  updateDoc,
  getDoc,
} from "firebase/firestore";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { db, auth } from "../../firebase/firebase";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

const Withdraw = () => {
  const navigate = useNavigate();
  const [rechargeData, setRechargeData] = useState([]);
  const [withdrawAmount, setWithdrawAmount] = useState("");
  const [selectedBank, setSelectedBank] = useState("");
  const [banks, setBanks] = useState([]);
  const [authUser, setAuthUser] = useState([]);
  // Fetch user recharge data and calculate balance
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

      // Fetch user banks from Firestore
      const bankSnapshot = await getDocs(
        collection(db, `users/${currentUserId}/banks`)
      );
      const bankList = bankSnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setBanks(bankList);
    } catch (error) {
      console.error("Error fetching data: ", error);
    }
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
  useEffect(() => {
    getData();
    authUserData();
  }, []);

  // Handle withdraw request
  const handleWithdraw = async () => {
    if (withdrawAmount < 200) {
      toast.error("Minimum withdraw amount is ₹200.");
      return;
    }
    if (!selectedBank) {
      alert("Please select a bank.");
      return;
    }

    try {
      const currentUserId = auth.currentUser.uid;

      // Get selected bank details
      const selectedBankDetails = banks.find(
        (bank) => bank.id === selectedBank
      );

      // Check if bank details exist
      if (!selectedBankDetails) {
        toast.error("Selected bank details not found.");
        return;
      }

      // Check if user has enough balance before submitting the withdrawal request
      const userRef = doc(db, "users", currentUserId);
      const userSnapshot = await getDoc(userRef);
      const userData = userSnapshot.data();
      const newBalance = userData.amount - Number(withdrawAmount);

      if (newBalance < 0) {
        toast.error("Insufficient balance for withdrawal.");
        return;
      }

      // Update the user document with the new balance (deduct withdrawal amount)
      await updateDoc(userRef, {
        amount: newBalance,
      });

      // Add the withdrawal request with status 'pending'
      await addDoc(collection(db, "withdrawals"), {
        userId: currentUserId,
        amount: withdrawAmount,
        bankId: selectedBank,
        bankDetails: {
          bankName: selectedBankDetails.bankName,
          accountNumber: selectedBankDetails.accountNumber,
          accountHolderName: selectedBankDetails.accountHolderName,
          ifscCode: selectedBankDetails.ifscCode,
        },
        status: "pending", // Withdrawal request is pending
        createdAt: serverTimestamp(),
      });

      alert("Withdraw request submitted successfully!");
      setWithdrawAmount("");
      setSelectedBank("");
    } catch (error) {
      console.error("Error submitting withdrawal request: ", error);
    }
  };

  // Function to reverse the withdrawal if failed
  // const reverseWithdrawal = async (withdrawalId, withdrawalAmount) => {
  //   const currentUserId = auth.currentUser.uid;
  //   const userRef = doc(db, "users", currentUserId);
  //   const userSnapshot = await getDoc(userRef);
  //   const userData = userSnapshot.data();
  //   const reversedBalance = userData.amount + withdrawalAmount;
  //   await updateDoc(userRef, {
  //     amount: reversedBalance,
  //   });
  //   const withdrawalRef = doc(db, "withdrawals", withdrawalId);
  //   await updateDoc(withdrawalRef, {
  //     status: "failed", 
  //   });
  //   setBalance(reversedBalance);
  //   toast.error("Withdrawal failed. Amount has been reversed.");
  // };

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
          Withdraw
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

        {/* Withdraw Amount Input */}
        <Box sx={{ mt: 2 }}>
          <TextField
            type="number"
            label="Withdraw Amount"
            value={withdrawAmount}
            onChange={(e) => setWithdrawAmount(e.target.value)}
            fullWidth
          />
        </Box>
        <Button
          onClick={() => navigate("/add-bank")}
          sx={{
            mt: 2,
            color: "white",
            background: "#EBA834",
            "&:hover": { color: "white", background: "#EBA834" },
          }}
        >
          Add Bank
        </Button>
        {/* Bank Selection Dropdown */}
        <Box sx={{ mt: 2, width: "100%", p: 2 }}>
          <TextField
            select
            label="Select Bank"
            value={selectedBank}
            onChange={(e) => setSelectedBank(e.target.value)}
            fullWidth
          >
            {banks.map((bank) => (
              <MenuItem key={bank.id} value={bank.id}>
                {bank.bankName} ({bank.accountNumber})
              </MenuItem>
            ))}
          </TextField>
        </Box>

        {/* Submit Button */}
        <Box sx={{ mt: 3 }}>
          <Button
            variant="contained"
            color="primary"
            onClick={handleWithdraw}
            disabled={!selectedBank || withdrawAmount < 200}
          >
            Submit Withdraw Request
          </Button>
        </Box>
      </Box>
    </Box>
  );
};

export default Withdraw;
