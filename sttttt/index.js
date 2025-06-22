require('ts-node').register();
require('dotenv').config();

const { speechToText } = require('./functions/speechToText');
const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv").config();

const port = process.env.PORT ? Number(process.env.PORT) : 4000;
const app = express();

// Middleware
app.use(express.json({ limit: "50mb" }));
app.use(cors());

// In-memory storage for quiz results (use database in production)
let quizResults = [];

// Existing speech-to-text endpoint
app.post("/speech-to-text", (req, res) => {
  speechToText(req, res);
});

// New quiz results endpoints
app.post("/api/results", (req, res) => {
  try {
    const { set, answers, score } = req.body; // Include score in the request body

    const existingSet = quizResults.find(q => q.set === set);
    if (existingSet) {
      existingSet.answers = answers;
      existingSet.score = score; // Update score if set exists
    } else {
      quizResults.push({ set, answers, score }); // Add score to new set
    }

    res.status(200).json({ message: "Results saved successfully" });
  } catch (error) {
    console.error("Error saving results:", error);
    res.status(500).json({ error: "Failed to save results" });
  }
});

app.get("/api/total-results", (req, res) => {
  try {
    const totalResults = quizResults.reduce(
      (acc, setData) => {
        const score = setData.score || { correct: 0, total: 0, percentage: 0 };
        acc.correct += score.correct;
        acc.total += score.total;
        return acc;
      },
      { correct: 0, total: 0 }
    );

    totalResults.percentage = totalResults.total > 0 
      ? Math.round((totalResults.correct / totalResults.total) * 100) 
      : 0;

    res.json({
      sets: quizResults.length,
      answers: quizResults.flatMap(set => set.answers),
      score: totalResults
    });
  } catch (error) {
    console.error("Error calculating total results:", error);
    res.status(500).json({ error: "Failed to calculate total results" });
  }
});

app.get("/api/results", (req, res) => {
  res.json(quizResults);
});

app.get("/results", (req, res) => {
  const setNumber = parseInt(req.query.set) || 1;
  const selectedSet = quizResults.find(q => q.set === setNumber);
  const results = selectedSet ? selectedSet.answers : [];

  res.send(`
    <!DOCTYPE html>
    <html>
    <head>
        <title>Assessment Results</title>
        <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css" rel="stylesheet">
        <style>
          body { padding: 20px; background-color: #f8f9fa; } 
          .set-container { margin-bottom: 30px; padding: 20px; border-radius: 8px; background-color: #ffffff; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1); }
          .set-title { font-size: 1.8rem; font-weight: bold; margin-bottom: 15px; color: #343a40; }
          .question-card { margin-bottom: 10px; font-size: 1rem; border-radius: 8px; box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1); }
          .correct { background-color: #d4edda; border-color: #c3e6cb; }
          .incorrect { background-color: #f8d7da; border-color: #f5c6cb; }
          .unanswered { background-color: #fff3cd; border-color: #ffeeba; }
          .card-body { padding: 15px; }
          .card-title { font-size: 1.2rem; color: #495057; }
          .card-text { font-size: 1rem; color: #6c757d; }
          h1 { font-size: 2rem; color: #007bff; }
          .assessment-message { font-size: 1.2rem; font-style: italic; color: #333; margin-top: 20px; text-align: center; }
          #total-score { font-size: 1.5rem; font-weight: bold; color: #28a745; margin-bottom: 20px; text-align: center; }
        </style>
    </head>
    <body>
      <div class="container">
        <h1 class="mb-4 text-center">Quiz Results</h1>
        <div id="total-score">Loading total score...</div>
        <div id="results-container">
          ${quizResults
            .map((setData) => {
              const incorrectCount = setData.answers.filter(result => result?.answer && !result.correct).length;
              let message = incorrectCount > 8 ? `<p class="assessment-message">The assessment has ended at Set ${setData.set}.</p>` : '';

              return `
                <div class="set-container">
                  <p class="set-title">Set ${setData.set}</p> 
                  <div class="row">
                    ${setData.answers
                      .map((result, index) => `
                        <div class="col-md-6">
                          <div class="card question-card ${result?.answer ? 
                            (result.correct ? 'correct' : 'incorrect') : 'unanswered'}">
                            <div class="card-body">
                              <h5 class="card-title">Question ${index + 1}</h5>
                              <p class="card-text">
                                ${result?.answer ? `
                                  Answer: ${result.answer}<br>
                                  Status: ${result.correct ? 'Correct ✓' : 'Incorrect ✗'}
                                ` : 'Not answered'}
                              </p>
                            </div>
                          </div>
                        </div>
                      `)
                      .join('')}
                  </div>
                  ${message}
                </div>
              `;
            })
            .join('')}
        </div>
      </div>
      <script>
        // Fetch total score when page loads
        fetch('/api/total-results')
          .then(response => response.json())
          .then(data => {
            const score = data.score;
            document.getElementById('total-score').innerText = 
              \`Total Score: \${score.correct} / \${score.total} (\${score.percentage}%)\`;
          })
          .catch(error => {
            console.error('Error fetching total score:', error);
            document.getElementById('total-score').innerText = 'Error loading total score';
          });
      </script>
    </body>
    </html>
  `); 
});

// Health check endpoint
app.get("/", (req, res) => {
  res.send("The Speech-to-Text API is up and running!");
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});