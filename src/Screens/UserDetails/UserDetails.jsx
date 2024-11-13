import { Avatar, Box, IconButton, Typography } from "@mui/material";
import React, { useEffect, useState } from "react";
import DUMMYUSER from "../../Assets/219988.png";
import WalletIcon from "@mui/icons-material/Wallet";
import AccountBalanceWalletIcon from "@mui/icons-material/AccountBalanceWallet";
import PlaylistAddCheckIcon from "@mui/icons-material/PlaylistAddCheck";
import { useNavigate } from "react-router-dom";
import { db, auth } from "../../firebase/firebase";
import { collection, getDocs, query } from "firebase/firestore";
import AccountBalanceIcon from '@mui/icons-material/AccountBalance';
const UserDetails = ({ userId }) => {
  const navigate = useNavigate();
  const [rechargeData, setRechargeData] = useState([]);
  const [authUser, setAuthUser] = useState([]);
  const [balance, setBalance] = useState(0);

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
      const totalBalance = userRechargeItems.reduce(
        (total, item) => total + item.amount,
        0
      );
      setBalance(totalBalance);
    } catch (error) {
      console.error("Error fetching recharge data: ", error);
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
  return (
    <>
      <Box
        sx={{
          width: "100%",
          height: "calc(100vh - 100px)",
          display: "flex",
          flexDirection: "column",
          gap: "20px",
        }}
      >
        <Box
          sx={{
            width: "100%",
            borderRadius: "12px",
            background: "#EBA834",
            boxShadow:
              "rgba(50, 50, 93, 0.25) 0px 6px 12px -2px, rgba(0, 0, 0, 0.3) 0px 3px 7px -3px",
            p: 1,
            display: "flex",
            flexDirection: "column",
            gap: "20px",
          }}
        >
          <Box
            sx={{ width: "100%", display: "flex", justifyContent: "center" }}
          >
            <Avatar sx={{ width: "80px", height: "80px" }}>
              <img src={DUMMYUSER} alt="" style={{ width: "100%" }} />
            </Avatar>
          </Box>
          <Box sx={{ display: "flex", flexDirection: "column", gap: "10px" }}>
            <Typography
              sx={{ color: "white", fontSize: "16px", fontWeight: "600" }}
            >
              <span style={{ fontWeight: "800", fontSize: "18px" }}>
                User Id :{" "}
              </span>{" "}
              {userId}
            </Typography>
            <Typography
              sx={{ color: "white", fontSize: "16px", fontWeight: "600" }}
            >
              {" "}
              <span style={{ fontWeight: "800", fontSize: "18px" }}>
                Available Balance :{" "}
              </span>{" "}
              ₹ {authUser?.amount?.toFixed(2)}
            </Typography>
          </Box>
        </Box>
        <Box
          sx={{
            width: "100%",
            borderRadius: "12px",
            background: "#EBA834",
            boxShadow:
              "rgba(50, 50, 93, 0.25) 0px 6px 12px -2px, rgba(0, 0, 0, 0.3) 0px 3px 7px -3px",
            p: 1,
            display: "flex",
            gap: "20px",
            justifyContent: "space-between",
          }}
        >
          <Box
            sx={{
              width: "100%",
              display: "flex",
              justifyContent: "center",
              flexDirection: "column",
              alignItems: "center",
            }}
          >
            <IconButton onClick={() => navigate("/recharge")}>
              <WalletIcon sx={{ color: "white", fontSize: "28px" }} />
            </IconButton>
            <Typography
              sx={{ fontSize: "16px", fontWeight: "600", color: "white" }}
            >
              Recharge
            </Typography>
          </Box>
          <Box
            sx={{
              width: "100%",
              display: "flex",
              justifyContent: "center",
              flexDirection: "column",
              alignItems: "center",
            }}
          >
            <IconButton onClick={() => navigate("/withdraw")}>
              <AccountBalanceWalletIcon
                sx={{ color: "white", fontSize: "28px" }}
              />
            </IconButton>
            <Typography
              sx={{ fontSize: "16px", fontWeight: "600", color: "white" }}
            >
              Withdraw
            </Typography>
          </Box>
          <Box
            sx={{
              width: "100%",
              display: "flex",
              justifyContent: "center",
              flexDirection: "column",
              alignItems: "center",
            }}
          >
            <IconButton>
              <PlaylistAddCheckIcon sx={{ color: "white", fontSize: "28px" }} />
            </IconButton>
            <Typography
              sx={{ fontSize: "16px", fontWeight: "600", color: "white" }}
            >
              All Orders
            </Typography>
          </Box>
        </Box>
        <Box
          sx={{
            width: "100%",
            display: "flex",
            flexDirection: "column",
            gap: "20px",
          }}
        >
          <Box
            sx={{
              width: "100%",
              display: "flex",
              gap: "10px",
              alignItems: "center",
              borderRadius: "12px",
              boxShadow: "rgba(99, 99, 99, 0.2) 0px 2px 8px 0px",
              p: 1,
            }}
            onClick={() => navigate("/recharge-history")}
          >
            <IconButton>
              <WalletIcon sx={{ color: "#EBA834", fontSize: "28px" }} />
            </IconButton>
            <Typography
              sx={{ fontSize: "18px", fontWeight: "600", color: "black" }}
            >
              Recharge History
            </Typography>
          </Box>
          <Box
            sx={{
              width: "100%",
              display: "flex",
              gap: "10px",
              alignItems: "center",
              borderRadius: "12px",
              boxShadow: "rgba(99, 99, 99, 0.2) 0px 2px 8px 0px",
              p: 1,
            }}
            onClick={() => navigate("/withdraw-history")}
          >
            <IconButton>
              <AccountBalanceWalletIcon
                sx={{ color: "#EBA834", fontSize: "28px" }}
              />
            </IconButton>
            <Typography
              sx={{ fontSize: "18px", fontWeight: "600", color: "black" }}
            >
              Withdrawl History
            </Typography>
          </Box>
          <Box
            sx={{
              width: "100%",
              display: "flex",
              gap: "10px",
              alignItems: "center",
              borderRadius: "12px",
              boxShadow: "rgba(99, 99, 99, 0.2) 0px 2px 8px 0px",
              p: 1,
            }}
            onClick={() => navigate("/add-bank")}
          >
            <IconButton>
              <AccountBalanceIcon
                sx={{ color: "#EBA834", fontSize: "28px" }}
              />
            </IconButton>
            <Typography
              sx={{ fontSize: "18px", fontWeight: "600", color: "black" }}
            >
              Add Bank Card
            </Typography>
          </Box>
        </Box>
      </Box>
    </>
  );
};

export default UserDetails;
