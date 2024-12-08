package main

import (
	"flag"
	"fmt"
	"io"
	"log"
	"net/http"
	"os"
	"path/filepath"
)

// Country represents a country with a name and an integer code.
type Country struct {
	Name string
	Code string
}

// List of countries with their respective codes.
var countries = []Country{
	{"Albania", "53"},
	{"Andorra", "41"},
	{"Argentina", "49"},
	{"Armenia", "94"},
	{"Australia", "29"},
	{"Austria", "4"},
	{"Belgium", "8"},
	{"Bolivia", "74"},
	{"Bosnia and Herzegovina", "56"},
	{"Botswana", "120"},
	{"Brazil", "50"},
	{"Bulgaria", "47"},
	{"Canada", "24"},
	{"Chile", "48"},
	{"China", "36"},
	{"Colombia", "52"},
	{"Costa Rica", "67"},
	{"Croatia", "31"},
	{"Cyprus", "34"},
	{"Czech Republic", "32"},
	{"Denmark", "18"},
	{"Egypt", "116"},
	{"Estonia", "30"},
	{"Finland", "25"},
	{"France", "6"},
	{"Georgia", "95"},
	{"Germany", "7"},
	{"Greece", "26"},
	{"Guatemala", "63"},
	{"Hungary", "33"},
	{"Iceland", "35"},
	{"India", "44"},
	{"Indonesia", "59"},
	{"Iran", "102"},
	{"Ireland", "22"},
	{"Israel", "57"},
	{"Italy", "12"},
	{"Japan", "109"},
	{"Jordan", "86"},
	{"Kazakhstan", "97"},
	{"Kuwait", "39"},
	{"Kyrgyzstan", "93"},
	{"Laos", "81"},
	{"Latvia", "60"},
	{"Lebanon", "85"},
	{"Lesotho", "139"},
	{"Libya", "114"},
	{"Lithuania", "61"},
	{"Luxembourg", "17"},
	{"Malaysia", "78"},
	{"Mauritius", "164"},
	{"Mexico", "37"},
	{"Moldova", "111"},
	{"Montenegro", "54"},
	{"Morocco", "38"},
	{"Mozambique", "145"},
	{"Namibia", "146"},
	{"Nepal", "107"},
	{"Netherlands", "9"},
	{"New Zealand", "28"},
	{"North Macedonia", "55"},
	{"Norway", "13"},
	{"Oman", "89"},
	{"Pakistan", "43"},
	{"Peru", "62"},
	{"Philippines", "84"},
	{"Poland", "51"},
	{"Portugal", "15"},
	{"Puerto Rico", "163"},
	{"Romania", "46"},
	{"Russia", "2"},
	{"Saudi Arabia", "87"},
	{"Serbia", "161"},
	{"Slovakia", "27"},
	{"Slovenia", "45"},
	{"South Africa", "42"},
	{"Spain", "11"},
	{"Sweden", "19"},
	{"Switzerland", "16"},
	{"Syria", "100"},
	{"Tajikistan", "92"},
	{"Thailand", "80"},
	{"Tunisia", "117"},
	{"Turkey", "21"},
	{"Ukraine", "112"},
	{"United Arab Emirates", "90"},
	{"United Kingdom", "1"},
	{"United States", "23"},
	{"Uruguay", "76"},
	{"Uzbekistan", "104"},
	{"Vietnam", "82"},
	{"Zimbabwe", "159"},
}

const baseURL = "https://www.bestbikingroads.com/dcountry.php?code=%s"

func main() {
	// Define and parse command-line flags
	outputDir := flag.String("out", "data", "Directory to save JSON files")
	flag.Parse()

	// Create the output directory if it doesn't exist
	err := os.MkdirAll(*outputDir, os.ModePerm)
	if err != nil {
		log.Fatalf("Failed to create output directory '%s': %v", *outputDir, err)
	}

	// Iterate through each country
	for _, country := range countries {
		filename := fmt.Sprintf("%s.json", country.Name)
		filePath := filepath.Join(*outputDir, filename)

		// Check if the file exists and is non-empty
		if fileExistsAndNotEmpty(filePath) {
			log.Printf("Skipping '%s': File already exists and is not empty.", country.Name)
			continue
		}

		// Construct the URL
		url := fmt.Sprintf(baseURL, country.Code)

		// Download the JSON data
		log.Printf("Downloading data for '%s' from '%s'...", country.Name, url)
		data, err := downloadJSON(url)
		if err != nil {
			log.Printf("Error downloading data for '%s': %v", country.Name, err)
			continue
		}

		// Save the JSON data to file
		err = saveToFile(filePath, data)
		if err != nil {
			log.Printf("Error saving data for '%s' to file: %v", country.Name, err)
			continue
		}

		log.Printf("Successfully saved data for '%s' to '%s'.", country.Name, filePath)
	}
}

// fileExistsAndNotEmpty checks if a file exists and has a size greater than zero.
func fileExistsAndNotEmpty(path string) bool {
	info, err := os.Stat(path)
	if os.IsNotExist(err) {
		return false
	}
	if err != nil {
		log.Printf("Error checking file '%s': %v", path, err)
		return false
	}
	return !info.IsDir() && info.Size() > 0
}

// downloadJSON downloads the JSON data from the given URL.
func downloadJSON(url string) ([]byte, error) {
	resp, err := http.Get(url)
	if err != nil {
		return nil, fmt.Errorf("HTTP GET request failed: %w", err)
	}
	defer resp.Body.Close()

	// Check for non-200 status codes
	if resp.StatusCode != http.StatusOK {
		return nil, fmt.Errorf("received non-OK HTTP status: %s", resp.Status)
	}

	// Read the response body
	data, err := io.ReadAll(resp.Body)
	if err != nil {
		return nil, fmt.Errorf("reading response body failed: %w", err)
	}

	return data, nil
}

// saveToFile saves the data to the specified file path.
func saveToFile(path string, data []byte) error {
	// Create or truncate the file
	file, err := os.Create(path)
	if err != nil {
		return fmt.Errorf("creating file failed: %w", err)
	}
	defer file.Close()

	// Write data to the file
	_, err = file.Write(data)
	if err != nil {
		return fmt.Errorf("writing to file failed: %w", err)
	}

	return nil
}
