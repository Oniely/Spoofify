## Spoofify

**Spoofify** is a Spotify downloader application that allows users to download tracks or playlists from Spotify using a provided Spotify link. By simply inputting the Spotify link, Spoofify will locate and enable the download of the specified tracks for offline use.

### Features

- Download individual tracks or entire playlists from Spotify
- User-friendly interface for easy link input and download initiation
- High-quality audio downloads
- Supports multiple download formats

### Installation

1. Clone the repository:
    ```sh
    git clone https://github.com/yourusername/spoofify.git
    ```
2. Navigate to the project directory:
    ```sh
    cd spoofify
    ```
3. Install the required dependencies:
    ```sh
    bun install
    ```
4. Get you Spotify API keys from Spotify:
    ```sh
    https://developer.spotify.com/dashboard
    ```
5. Create a .env file and add your KEYS: 
    ```sh
    CLIENT_ID=***
    CLIENT_SECRET=***
    ```

### Usage

1. Run the application:
    ```sh
    bun run dev
    ```
2. Enter the Spotify link for the track or playlist you wish to download.
3. Follow the on-screen prompts to complete your download.

### Contributing

Contributions are welcome! Please fork the repository and submit a pull request for any enhancements or bug fixes.
