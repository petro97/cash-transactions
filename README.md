# Transactions cash task

This project calculates commission fees cash-in and cash-out transactions based on the provided configurations. It processes input data from a JSON file and outputs the calculated commission fees to the standard output.

## Requirements

- Node.js (v14 or later)
- npm (v6 or later)

## Installation

1. **Clone the repository:**

    ```bash
    git clone https://github.com/petro97/cash-transactions
    cd cash-transactions
    ```

2. **Install dependencies:**

    ```bash
    npm install
    ```

3. **Set up API keys:**

Create a `.env` file in the root directory of the project and add the following environment variables:

```env
API_HOST=https://api.example.com
```


## Usage

To run the application, use the following command:

```bash
node src/app.js <path_to_input_file>
```

To run the application with example JSON file data, use the following command:

```bash
npm start
```


## Tests

To run jest tests, use the following command:

```bash
npm test
```

