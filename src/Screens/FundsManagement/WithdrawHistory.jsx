import { Box, CircularProgress, IconButton, Typography } from "@mui/material";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  collection,
  getDocs,
  query,
  addDoc,
  serverTimestamp,
} from "firebase/firestore";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { db, auth } from "../../firebase/firebase"; // Import auth to get the logged-in user
import moment from "moment/moment";

const WithdrawHistory = () => {
  const [withdrawData, setWithdrawData] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const getData = async () => {
    setLoading(true);
    try {
      const q = query(collection(db, "withdrawals"));
      const querySnapshot = await getDocs(q);
      const rechargeItems = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));

      const currentUserId = auth.currentUser.uid;
      const userRechargeItems = rechargeItems.filter(
        (item) => item.userId === currentUserId
      );
      setWithdrawData(userRechargeItems);
      setLoading(false);
    } catch (error) {
      setLoading(false);
      console.error("Error fetching recharge data: ", error);
    }
  };
  useEffect(() => {
    getData();
  }, []);
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
            width: "100%",
            p: 1,
            display: "flex",
            justifyContent: "center",
          }}
        >
          <Typography
            sx={{
              fontSize: "26px",
              fontWeight: "600",
              my: 2,
              color: "#EBA834",
            }}
          >
            Withdrawal History
          </Typography>
        </Box>
        {loading ? (
          <Box
            sx={{
              width: "100%",
              height: "calc(100vh - 150px)",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <CircularProgress sx={{ color: "#EBA834" }} />
          </Box>
        ) : (
          <Box
            sx={{
              width: "100%",
              display: "flex",
              flexDirection: "column",
              gap: "10px",
              p: 1,
              height: "calc(100vh - 150px)",
              overflow: "scroll",
            }}
          >
            {withdrawData
              ?.sort((x, y) => {
                return y?.createdAt?.seconds - x?.createdAt?.seconds;
              })
              ?.map((item, index) => {
                const formattedDate =
                  item?.createdAt && moment(item?.createdAt.toDate()).isValid()
                    ? moment(item?.createdAt.toDate()).format(
                        "DD-MM-YYYY, h:mm A"
                      )
                    : "Invalid Date"; // fallback text for invalid date

                return (
                  <Box
                    key={index}
                    sx={{
                      width: "100%",
                      p: 1,
                      display: "flex",
                      flexDirection: "column",
                      gap: "20px",
                      borderRadius: "12px",
                      boxShadow: "rgba(99, 99, 99, 0.2) 0px 2px 8px 0px",
                    }}
                  >
                    <Box
                      sx={{
                        width: "100%",
                        display: "flex",
                        justifyContent: "space-between",
                      }}
                    >
                      <Typography sx={{ color: "black", fontWeight: "600" }}>
                        {item?.bankDetails?.accountHolderName}
                      </Typography>
                      <Typography sx={{ color: "red" }}>
                        - ₹ {item?.amount}
                      </Typography>
                    </Box>
                    <Box>
                      <Typography>To :</Typography>
                      <Box sx={{ width: "100%" }}>
                        <Typography sx={{ fontWeight: "600" }}>
                          Bank Name : {item?.bankDetails?.bankName}
                        </Typography>
                        <Typography sx={{ fontWeight: "600" }}>
                          Acc. No : {item?.bankDetails?.accountNumber}
                        </Typography>
                      </Box>
                    </Box>
                    <Box
                      sx={{
                        width: "100%",
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                      }}
                    >
                      <Typography
                        sx={{
                          color: "black",
                          fontSize: "14px",
                          fontWeight: "600",
                        }}
                      >
                        {formattedDate}
                      </Typography>
                      <Typography
                        sx={{
                          color: "black",
                          fontSize: "14px",
                          fontWeight: "600",
                        }}
                      >
                        {item?.status}
                      </Typography>
                    </Box>
                  </Box>
                );
              })}
          </Box>
        )}
      </Box>
    </>
  );
};

export default WithdrawHistory;
