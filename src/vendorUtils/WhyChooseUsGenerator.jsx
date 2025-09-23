import { useState } from 'react';
import {
    Box,
    Button,
    Paper,
    Grid,
    TextField,
    Skeleton
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import InfoIcon from '@mui/icons-material/Info';
import StarIcon from '@mui/icons-material/Star';
import ThumbUpIcon from '@mui/icons-material/ThumbUp';
import VerifiedUserIcon from '@mui/icons-material/VerifiedUser';
import { apiUrl, backendApi } from '../Api/Api';
import axios from 'axios';

// Map 4 icons
const icons = [
    <StarIcon color="primary" sx={{ fontSize: 40 }} />,
    <ThumbUpIcon color="secondary" sx={{ fontSize: 40 }} />,
    <VerifiedUserIcon color="success" sx={{ fontSize: 40 }} />,
    <InfoIcon color="action" sx={{ fontSize: 40 }} />,
];

export default function WhyChooseUsGenerator({ description, customFields = [], customPricing = [], onGenerate, }) {
    const [loading, setLoading] = useState(false);
    const [rawText, setRawText] = useState('');
    const [reasons, setReasons] = useState([]);

    //     const OPENROUTER_API_KEY = "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";

    //     const generateReasons = async () => {
    //         setLoading(true);
    //         setRawText('');
    //         setReasons([]);

    //         const combinedFields = [...customFields, ...customPricing];
    //         const extraDetails = combinedFields
    //             .filter(field => field.name && field.value !== null && field.value !== "" && field.value !== 0)
    //             .map(field => `${field.name}: ${field.value}`)
    //             .join('\n');

    //         const combinedDescription = `${description}\n\nAdditional Info:\n${extraDetails}`;

    //         try {
    //             const res = await fetch("https://openrouter.ai/api/v1/chat/completions", {
    //                 method: "POST",
    //                 headers: {
    //                     "Authorization": `Bearer ${OPENROUTER_API_KEY}`,
    //                     "HTTP-Referer": `${apiUrl}`,
    //                     "X-Title": "onivah",
    //                     "Content-Type": "application/json",
    //                 },
    //                 body: JSON.stringify({
    //                     model: "qwen/qwen3-coder:free",
    //                     messages: [
    //                         {
    //                             role: "user",
    //                             content: `Based on the following vendor description, generate 4 compelling reasons to include in a "Why Choose Us" section for a wedding service website.
    // Each reason should have:
    // - A clear and catchy title (max 6 words)
    // - A short description (no more than 25 words)

    // Vendor Details:
    // ${combinedDescription}

    // Format:
    // 1. <Title>: <Short Description>
    // 2. ...
    // 3. ...
    // 4. ...`,
    //                         },
    //                     ],
    //                 }),
    //             });

    //             const data = await res.json();
    //             const fullText = data.choices?.[0]?.message?.content || "";

    //             setRawText(fullText);

    //             const parsedReasons = parseReasons(fullText);
    //             setReasons(parsedReasons);

    //             if (onGenerate && typeof onGenerate === "function") {
    //                 onGenerate(parsedReasons);
    //             }
    //         } catch (err) {
    //             console.error("Error calling OpenRouter:", err);
    //         } finally {
    //             setLoading(false);
    //         }
    //     };

    //     const parseReasons = (text) => {
    //         const reasonLines = text
    //             .split(/\r?\n/)
    //             .map(line => line.trim())
    //             .filter(line => /^\d+\./.test(line));

    //         return reasonLines.map(line => {
    //             const match = line.match(/^\d+\.\s*(.+?)[\:\-]\s*(.+)$/);
    //             if (!match) return null;

    //             let title = match[1].trim();
    //             let description = match[2].trim();
    //             title = title.replace(/^\*\*(.+)\*\*$/, "$1");

    //             return { title, description };
    //         }).filter(Boolean);
    //     };

    // const generateReasons = async () => {
    //     setLoading(true);
    //     setRawText('');
    //     setReasons([]);

    //     const combinedFields = [...customFields, ...customPricing];
    //     const extraDetails = combinedFields
    //         .filter(field => field.name && field.value !== null && field.value !== "" && field.value !== 0)
    //         .map(field => `${field.name}: ${field.value}`)
    //         .join('\n');

    //     const combinedDescription = `${description}\n\nAdditional Info:\n${extraDetails}`;

    //     try {
    //         const res = await fetch(`${apiUrl}/generate/why-us-reasons`, {
    //             method: "POST",
    //             headers: { "Content-Type": "application/json" },
    //             body: JSON.stringify({ combinedDescription }),
    //         });

    //         const data = await res.json();
    //         const fullText = data.fullText;

    //         setRawText(fullText);

    //         const parsedReasons = parseReasons(fullText);
    //         setReasons(parsedReasons);

    //         if (onGenerate && typeof onGenerate === "function") {
    //             onGenerate(parsedReasons);
    //         }
    //     } catch (err) {
    //         console.error("Error calling Groq:", err);
    //     } finally {
    //         setLoading(false);
    //     }
    // };

    const generateReasons = async () => {
        setLoading(true);
        setRawText('');
        setReasons([]);

        const combinedFields = [...customFields, ...customPricing];
        const extraDetails = combinedFields
            .filter(field => field.name && field.value !== null && field.value !== "" && field.value !== 0)
            .map(field => `${field.name}: ${field.value}`)
            .join('\n');

        const combinedDescription = `${description}\n\nAdditional Info:\n${extraDetails}`;

        try {
            const { data } = await backendApi.post(
                `/generate/why-us-reasons`,
                { combinedDescription },  // request body
                { headers: { "Content-Type": "application/json" } }
            );

            const fullText = data.fullText;
            setRawText(fullText);

            const parsedReasons = parseReasons(fullText);
            setReasons(parsedReasons);

            if (onGenerate && typeof onGenerate === "function") {
                onGenerate(parsedReasons);
            }
        } catch (err) {
            console.error("Error calling Groq:", err);
        } finally {
            setLoading(false);
        }
    };


    const parseReasons = (text) => {
        const reasonLines = text
            .split(/\r?\n/)
            .map(line => line.trim())
            .filter(line => /^\d+\./.test(line));

        return reasonLines.map(line => {
            const match = line.match(/^\d+\.\s*(.+?)[\:\-]\s*(.+)$/);
            if (!match) return null;

            let title = match[1].trim();
            let description = match[2].trim();
            title = title.replace(/^\*\*(.+)\*\*$/, "$1");

            return { title, description };
        }).filter(Boolean);
    };


    const handleReasonChange = (index, field, value) => {
        setReasons(prev => {
            const updated = [...prev];
            updated[index][field] = value;
            return updated;
        });
    };

    return (
        <Box mt={4}>


            <Button
                variant="contained"
                onClick={generateReasons}
                disabled={loading}
            >
                {loading ? 'Generating...' : 'Generate Why Choose Us'}
            </Button>


            <Grid container spacing={3} mt={2}>
                {loading
                    ? Array(4).fill(0).map((_, idx) => (
                        <Grid item xs={12} sm={6} md={6} key={idx}>
                            <Paper
                                elevation={4}
                                sx={{ p: 3, display: 'flex', alignItems: 'flex-start', gap: 2, borderRadius: 3, minHeight: 140 }}
                            >
                                <Skeleton variant="circular" width={40} height={40} />
                                <Box sx={{ flex: 1 }}>
                                    <Skeleton variant="text" width="60%" height={30} />
                                    <Skeleton variant="text" width="80%" height={20} />
                                    <Skeleton variant="text" width="90%" height={20} />
                                </Box>
                            </Paper>
                        </Grid>
                    ))
                    : reasons.map((reason, idx) => (
                        <Grid item xs={12} sm={6} md={6} key={idx}>
                            <Paper
                                elevation={0}
                                sx={{ p: 3, display: 'flex', alignItems: 'flex-start', gap: 2, borderRadius: 3, minHeight: 140 }}
                            >
                                <Box sx={{ mt: 0.5 }}>{icons[idx % icons.length]}</Box>
                                <Box sx={{ flex: 1 }}>
                                    <TextField
                                        fullWidth
                                        variant="standard"
                                        label="Title"
                                        value={reason.title}
                                        onChange={e => handleReasonChange(idx, 'title', e.target.value)}
                                        sx={{ mb: 2 }}
                                    />
                                    <TextField
                                        fullWidth
                                        variant="standard"
                                        label="Description"
                                        value={reason.description}
                                        onChange={e => handleReasonChange(idx, 'description', e.target.value)}
                                        multiline
                                        minRows={2}
                                    />
                                </Box>
                            </Paper>
                        </Grid>
                    ))
                }
            </Grid>
        </Box>
    );
}
