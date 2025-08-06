package localsrc

import (
	"errors"
	"log"
	"time"
)

func InsertStartIdle(start time.Time) (bool, error) {
	if DB == nil {
		log.Println("DB is not initialized")
		return false, errors.New("DB is not initialized")
	}

	stmt, err := DB.Prepare("INSERT INTO idlelog(start_time) VALUES (?)")

	if err != nil {
		log.Printf("Prepare failed: %v \n", err)
		return false, err
	}
	defer stmt.Close()

	_, err = stmt.Exec(start.Format(time.RFC3339))

	if err != nil {
		log.Fatalf("Exec failed: %v", err)
		return false, err
	}
	return true, nil
}

func InsertStopIdle(end time.Time) (bool, error) {
	if DB == nil {
		log.Printf("DB is not initialized")
		return false, ErrDBNotInitialized
	}

	// Step 1: Get latest unclosed time log
	var id int
	err := DB.QueryRow("SELECT id FROM idlelog WHERE end_time IS NULL ORDER BY id DESC LIMIT 1").Scan(&id)
	if err != nil {
		log.Printf("Failed to find unclosed idlelog: %v", err)
		return false, err
	}

	// Step 2: Update that record
	stmt, err := DB.Prepare("UPDATE idlelog SET end_time = ? WHERE id = ?")
	if err != nil {
		log.Printf("Prepare failed: %v", err)
		return false, err
	}
	defer stmt.Close()

	_, err = stmt.Exec(end.Format(time.RFC3339), id)
	if err != nil {
		log.Printf("Exec failed: %v", err)
		return false, err
	}
	return true, nil
}
