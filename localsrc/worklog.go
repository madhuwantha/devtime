package localsrc

import (
	"errors"
	"log"
	"time"
)

func StartWork(start time.Time) (bool, error) {
	if DB == nil {
		log.Println("DB is not initialized")
		return false, errors.New("DB is not initialized")
	}

	stmt, err := DB.Prepare("INSERT INTO worklog(start_time) VALUES (?)")

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

func StopWork(end time.Time) (bool, error) {
	if DB == nil {
		log.Printf("DB is not initialized")
		return false, ErrDBNotInitialized
	}

	// Step 1: Get latest unclosed time log
	var id int
	err := DB.QueryRow("SELECT id FROM worklog WHERE end_time IS NULL ORDER BY id DESC LIMIT 1").Scan(&id)
	if err != nil {
		log.Printf("Failed to find unclosed worklog: %v", err)
		return false, err
	}

	// Step 2: Update that record
	stmt, err := DB.Prepare("UPDATE worklog SET end_time = ? WHERE id = ?")
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

func PauseWork(end time.Time) (bool, error) {
	if DB == nil {
		log.Printf("DB is not initialized")
		return false, ErrDBNotInitialized
	}

	// Step 1: Get latest unclosed time log
	var id int
	err := DB.QueryRow("SELECT id FROM worklog WHERE end_time IS NULL ORDER BY id DESC LIMIT 1").Scan(&id)
	if err != nil {
		log.Printf("Failed to find unclosed worklog: %v", err)
		return false, err
	}

	// Step 2: Update that record
	stmt, err := DB.Prepare("UPDATE worklog SET end_time = ?, is_pause = ? WHERE id = ?")
	if err != nil {
		log.Printf("Prepare failed: %v", err)
		return false, err
	}
	defer stmt.Close()

	_, err = stmt.Exec(end.Format(time.RFC3339), 1, id)
	if err != nil {
		log.Printf("Exec failed: %v", err)
		return false, err
	}
	return true, nil
}

func IsWorking() (bool, error) {
	if DB == nil {
		log.Printf("DB is not initialized")
		return false, ErrDBNotInitialized
	}

	// Step 1: Get latest unclosed time log
	var id int
	err := DB.QueryRow("SELECT id FROM worklog WHERE end_time IS NULL ORDER BY id DESC LIMIT 1").Scan(&id)
	if err != nil {
		log.Printf("Failed to find unclosed worklog: %v", err)
		return false, err
	}

	// var logcount int
	// err = DB.QueryRow("SELECT COUNT(1) as logcount FROM worklog").Scan(&logcount)
	// if err != nil {
	// 	log.Printf("Failed to find unclosed worklog: %v", err)
	// 	return false, err
	// }
	// if logcount > 0 {
	// 	return true, nil
	// }

	return true, nil
}
