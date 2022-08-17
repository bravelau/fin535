import React, { useState } from "react";
import {
    Container,
    TextField,
    Typography,
    Button,
    CssBaseline,
    Box,
    Grid,
    List,
    ListItemButton,
} from "@mui/material";
import { AccountBalanceWallet, DataObject, SettingsAccessibility } from "@mui/icons-material";
import { createTheme, ThemeProvider } from "@mui/material/styles";

const NotAvailableBox = ({ title }) => (
    <Box
        sx={{
            display: "flex",
            flexWrap: "wrap",
            justifyContent: "center",
            alignContent: "center",
            border: "solid 1px",
            height: "500px",
        }}
    >
        <Typography
            variant='h5'
            sx={{
                width: "100%",
                textAlign: "center",
            }}
        >
            {title}
        </Typography>
        <Box>Not Available</Box>
    </Box>
);

const MetadataBox = ({ metadata }) => (
    <Box
        sx={{
            display: "flex",
            flexWrap: "wrap",
            justifyContent: "center",
            alignContent: "start",
            border: "solid 1px",
            height: "500px",
            gap: 2,
        }}
    >
        <Typography variant='h5' sx={{ width: "100%", textAlign: "center" }}>
            Metadata
        </Typography>
        <Box
            sx={{
                display: "flex",
                p: 2,
                fontSize: "12px",
                alignItems: "center",
                alignContent: "center",
                backgroundColor: "#002d5c",
            }}
        >
            <pre>{JSON.stringify(metadata, null, "\t")}</pre>
        </Box>
    </Box>
);

const App = () => {
    const theme = createTheme({
        palette: {
            mode: "dark",
        },
    });
    const [address, setAddress] = useState(null);
    const [metadata, setMetadata] = useState(null);
    const [tokenIds, setTokenIds] = useState(null);

        const handleWalletClicked = async () => {
        console.log("address:", address);

        // Call getTokenBalances using the `address` state variable above and replace `null` with the result in setTokenIds() below
        // ...
        const url = 'http://localhost:5001/getTokenBalances/';

        const axios = require('axios');
        try {
            const response = await axios.get(url+address);
            const data = response.data;
            setTokenIds(data["result"]);
        }catch (e){
            setTokenIds(null);
        }
    };

    const handleTokenSelected = async (e) => {
        e.preventDefault();
        const tokenId = e.target.id;
        console.log("tokenSelected:", tokenId);

        // Call getTokenMetadata using the `tokenId` state variable above and replace `null` with the result in setMetadata() below
        // ...
        const url = 'http://localhost:5001/getTokenMetadata/';

        const axios = require('axios');
        try {
            const response = await axios.get(url+tokenId);
            const data = response.data;
            setMetadata(data["result"]);
        }catch (e){
            setMetadata(null);
        }
    };

    return (
        <>
            <ThemeProvider theme={theme}>
                <CssBaseline />
                <Container
                    sx={{
                        display: "flex",
                        flexWrap: "wrap",
                        alignItems: "center",
                        justifyContent: "center",
                        mt: 5,
                        gap: 2,
                    }}
                >
                    <Typography
                        variant='h4'
                        sx={{ width: "100%", textAlign: "center" }}
                    >
                        Wallet Address
                    </Typography>
                    <TextField
                        label='Enter your wallet address'
                        sx={{ width: "600px" }}
                        onChange={(e) => {
                            setAddress(e.target.value);
                        }}
                    ></TextField>
                    <Button
                        startIcon={<AccountBalanceWallet />}
                        onClick={handleWalletClicked}
                    >
                        Wallet
                    </Button>
                    <Typography
                        variant='h4'
                        sx={{ width: "100%", textAlign: "center" }}
                    >
                        Tokens
                    </Typography>
                    <Grid container spacing={2}>
                        <Grid item xs={6}>
                            {tokenIds ? (
                                <List
                                    sx={{
                                        border: "solid 1px",
                                        height: "500px",
                                    }}
                                >
                                    {tokenIds.map((tokenId) => (
                                        <ListItemButton
                                            id={tokenId}
                                            sx={{ fontSize: "12px" }}
                                            onClick={handleTokenSelected}
                                        >
                                            {tokenId}
                                        </ListItemButton>
                                    ))}
                                </List>
                            ) : (
                                <NotAvailableBox title='Tokens'></NotAvailableBox>
                            )}
                        </Grid>
                        <Grid item xs={6}>
                            {metadata ? (
                                <MetadataBox metadata={metadata}></MetadataBox>
                            ) : (
                                <NotAvailableBox title='Metadata'></NotAvailableBox>
                            )}
                        </Grid>
                    </Grid>
                </Container>
            </ThemeProvider>
        </>
    );
};

export default App;
