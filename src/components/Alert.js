import React, { useState, useEffect } from "react";
import Box from "@mui/material/Box";
import Alert from "@mui/material/Alert";
import IconButton from "@mui/material/IconButton";
import Collapse from "@mui/material/Collapse";
import CloseIcon from "@mui/icons-material/Close";

export default function Alerts({ message, severity }) {

    const [open, setOpen] = useState(true);

    useEffect(() => {
      // 5초 후에 알림을 자동으로 닫기
      const timer = setTimeout(() => {
          setOpen(false);
      }, 5000); // 5000ms = 5초

      // 클린업 함수: 컴포넌트가 언마운트되거나 타이머가 취소될 때 호출
      return () => clearTimeout(timer);
  }, []);

    if (!message) return null; // 메시지가 없으면 아무 것도 렌더링하지 않음

    return (
        <Box sx={{ width: "100%" }}>
            <Collapse in={open} timeout={500}>
                <Alert
                    ariant="filled"
                    severity={severity}
                    action={
                        <IconButton
                            aria-label="close"
                            color="inherit"
                            size="small"
                            onClick={() => {
                                setOpen(false);
                            }}
                        >
                            <CloseIcon fontSize="inherit" />
                        </IconButton>
                    }
                    sx={{ mb: 2 }}
                >
                    {message}
                </Alert>
            </Collapse>
        </Box>
    );
}
