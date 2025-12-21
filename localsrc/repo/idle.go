package repo

import (
	"database/sql"
	"errors"
	"log"
	"time"

	"github.com/madhuwantha/devtime/localsrc"
)

func GoIdle(start time.Time) error {
	if localsrc.DB == nil {
		log.Println("DB is not initialized")
		return errors.New("DB is not initialized")
	}

	stmt, err := localsrc.DB.Prepare("INSERT INTO idlelog(start_time) VALUES (?)")
	if err != nil {
		return err
	}
	defer stmt.Close()

	_, err = stmt.Exec(start.Format(time.RFC3339))
	if err != nil {
		return err
	}
	return nil
}

func UpdateLastIdle() error {
	log.Printf("Updating last idle")

	if localsrc.DB == nil {
		log.Println("DB is not initialized")
		return errors.New("DB is not initialized")
	}

	end := time.Now()
	query := "SELECT id FROM idlelog WHERE end_time IS NULL AND date(start_time) = date('now') ORDER BY id DESC LIMIT 1"

	var id int
	err := localsrc.DB.QueryRow(query).Scan(&id)
	if err != nil {
		if err == sql.ErrNoRows {
			log.Printf("No idle log found")
			return errors.New("no idle log found")
		}
		log.Printf("Error querying last idle: %v", err)
		return err
	}

	if id == 0 {
		return errors.New("no idle log found")
	}

	stmt, err := localsrc.DB.Prepare("UPDATE idlelog SET end_time = ? WHERE id = ?")
	if err != nil {
		log.Printf("Error preparing update last idle: %v", err)
		return err
	}
	defer stmt.Close()

	_, err = stmt.Exec(end.Format(time.RFC3339), id)
	if err != nil {
		log.Printf("Error updating last idle: %v", err)
		return err
	}
	return nil
}
