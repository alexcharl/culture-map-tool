# Cultural Assessment Tool

A web-based questionnaire tool inspired by Erin Meyer's Culture Map framework, designed to help individuals understand their cultural preferences across 8 key dimensions.

## Features

- **24 Questions**: 3 questions per dimension across 8 cultural scales
- **Visual Results**: Radar chart showing your position on each scale
- **Detailed Scores**: Individual breakdown of each dimension with descriptions
- **Export Functionality**: Download results as CSV file
- **Responsive Design**: Works on desktop, tablet, and mobile devices

## The 8 Cultural Dimensions

1. **Communicating**: Low-Context ↔ High-Context
   - How explicit vs. implicit your communication style is

2. **Evaluating**: Direct Negative Feedback ↔ Indirect Negative Feedback
   - How direct vs. indirect your feedback style is

3. **Persuading**: Principles-First ↔ Applications-First
   - Whether you prefer theoretical or practical approaches

4. **Leading**: Egalitarian ↔ Hierarchical
   - Your preference for flat vs. hierarchical structures

5. **Deciding**: Consensual ↔ Top-Down
   - Whether you prefer group consensus or leader decisions

6. **Trusting**: Task-Based ↔ Relationship-Based
   - How you build trust with colleagues

7. **Disagreeing**: Confrontational ↔ Avoids Confrontation
   - Your comfort level with open disagreement

8. **Scheduling**: Linear-Time ↔ Flexible-Time
   - Your approach to time and scheduling

## How to Use

1. **Open the Tool**: Open `index.html` in your web browser
2. **Answer Questions**: Use the 1-7 Likert scale to answer each question
3. **Navigate**: Use Previous/Next buttons to move through questions
4. **View Results**: After completing all questions, click "View Results"
5. **Interpret**: Review your radar chart and detailed scores
6. **Export**: Download your results as a CSV file if desired
7. **Retake**: Use "Retake Assessment" to start over

## Scoring System

- Each dimension is scored on a 1-7 scale
- Scores are calculated as the average of the 3 questions per dimension
- Results are rounded to 1 decimal place
- Score interpretations:
  - 1-2.5: Leans toward the left side of the scale
  - 2.6-5.4: Balanced between both approaches
  - 5.5-7: Leans toward the right side of the scale

## Technical Details

- **Frontend**: HTML5, CSS3, JavaScript (ES6+)
- **Charts**: Chart.js for radar chart visualization
- **No Backend**: Pure client-side application
- **Data Storage**: Results are not saved - download CSV to keep records

## File Structure

```
├── index.html          # Main HTML file
├── styles.css          # CSS styles and responsive design
├── script.js           # JavaScript functionality
└── README.md           # This documentation
```

## Customization

### Adding New Questions
To modify questions, edit the `dimensions` array in `script.js`. Each dimension object contains:
- `name`: Display name
- `scale`: Left and right labels separated by "↔"
- `description`: Brief description
- `questions`: Array of 3 questions

### Changing Scoring
Modify the `calculateDimensionScores()` method in `script.js` to change how scores are calculated.

### Styling
Edit `styles.css` to customize colors, fonts, and layout.

## Browser Compatibility

- Chrome 60+
- Firefox 55+
- Safari 12+
- Edge 79+

## License

This tool is provided as-is for educational and personal use. The cultural framework is based on Erin Meyer's Culture Map methodology.

## Credits

- Cultural framework inspired by Erin Meyer's "The Culture Map"
- Chart visualization powered by Chart.js
- Modern UI design with responsive CSS 
