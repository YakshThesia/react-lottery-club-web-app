import { Box, Button, IconButton, TextField, Typography } from "@mui/material";
import React, { useState, useEffect } from "react";
import { collection, getDocs, addDoc, serverTimestamp } from "firebase/firestore";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { db, auth } from "../../firebase/firebase";
import { useNavigate } from "react-router-dom";

const AddBank = () => {
  const navigate = useNavigate();
  const [accountHolderName, setAccountHolderName] = useState("");
  const [accountNumber, setAccountNumber] = useState("");
  const [bankName, setBankName] = useState("");
  const [ifscCode, setIfscCode] = useState("");
  const [banks, setBanks] = useState([]);

  // Fetching user's bank details
  const fetchBanks = async () => {
    try {
      const currentUserId = auth.currentUser.uid;
      const q = collection(db, `users/${currentUserId}/banks`);
      const querySnapshot = await getDocs(q);
      const bankItems = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setBanks(bankItems);
    } catch (error) {
      console.error("Error fetching bank details: ", error);
    }
  };

  useEffect(() => {
    fetchBanks();
  }, []);

  // Add new bank details to Firestore
  const handleSubmit = async () => {
    if (!accountHolderName || !accountNumber || !bankName || !ifscCode) {
      alert("All fields are mandatory.");
      return;
    }

    try {
      const currentUserId = auth.currentUser.uid;
      await addDoc(collection(db, `users/${currentUserId}/banks`), {
        accountHolderName,
        accountNumber,
        bankName,
        ifscCode,
        createdAt: serverTimestamp(),
      });
      alert("Bank details added successfully!");
      // Clear input fields after successful submission
      setAccountHolderName("");
      setAccountNumber("");
      setBankName("");
      setIfscCode("");
      // Fetch the updated list of banks
      fetchBanks();
    } catch (error) {
      console.error("Error adding bank details: ", error);
    }
  };

  return (
    <>
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
            sx={{
              fontSize: "30px",
              fontWeight: "600",
              my: 2,
              color: "#EBA834",
            }}
          >
            Add Bank Details
          </Typography>

          {/* Form for Adding Bank Details */}
          <Box sx={{ width: "80%", maxWidth: "500px", mt: 2 }}>
            <TextField
              label="Account Holder's Name"
              value={accountHolderName}
              onChange={(e) => setAccountHolderName(e.target.value)}
              fullWidth
              margin="normal"
              required
            />
            <TextField
              label="Account Number"
              value={accountNumber}
              onChange={(e) => setAccountNumber(e.target.value)}
              fullWidth
              margin="normal"
              required
            />
            <TextField
              label="Bank Name"
              value={bankName}
              onChange={(e) => setBankName(e.target.value)}
              fullWidth
              margin="normal"
              required
            />
            <TextField
              label="IFSC Code"
              value={ifscCode}
              onChange={(e) => setIfscCode(e.target.value)}
              fullWidth
              margin="normal"
              required
            />
          </Box>

          {/* Submit Button */}
          <Button
            variant="contained"
            color="primary"
            sx={{ mt: 3 }}
            onClick={handleSubmit}
          >
            Add Bank
          </Button>

          {/* Display List of Added Banks */}
          <Box sx={{ mt: 4, width: "80%", maxWidth: "500px" }}>
            <Typography
              sx={{
                fontSize: "22px",
                fontWeight: "600",
                color: "#EBA834",
                mb: 2,
              }}
            >
              Added Banks
            </Typography>
            {banks.length > 0 ? (
              banks.map((bank) => (
                <Box
                  key={bank.id}
                  sx={{
                    p: 2,
                    border: "1px solid #ccc",
                    borderRadius: "8px",
                    mb: 2,
                    background: "#f9f9f9",
                  }}
                >
                  <Typography sx={{ fontWeight: "500" }}>
                    Account Holder: {bank.accountHolderName}
                  </Typography>
                  <Typography sx={{ fontWeight: "500" }}>
                    Account Number: {bank.accountNumber}
                  </Typography>
                  <Typography sx={{ fontWeight: "500" }}>
                    Bank Name: {bank.bankName}
                  </Typography>
                  <Typography sx={{ fontWeight: "500" }}>
                    IFSC Code: {bank.ifscCode}
                  </Typography>
                </Box>
              ))
            ) : (
              <Typography>No banks added yet.</Typography>
            )}
          </Box>
        </Box>
      </Box>
    </>
  );
};

export default AddBank;
