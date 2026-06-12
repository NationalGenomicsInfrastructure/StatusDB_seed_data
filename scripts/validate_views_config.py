import yaml
from pathlib import Path
import argparse

def scan_views_directory(views_dir):
    """Scan the views directory and return a config-like structure."""
    databases = {}
    if not views_dir.exists():
        return {"databases": databases}

    for db_path in sorted(views_dir.iterdir()):
        if not db_path.is_dir():
            continue
        db_name = db_path.name
        databases[db_name] = {"design_docs": {}}
        for item in sorted(db_path.iterdir()):
            if item.is_dir():
                design_doc_name = item.name
                databases[db_name]["design_docs"][design_doc_name] = {"views": {}}
                for view_file in sorted(item.glob("*.map.js")):
                    view_name = view_file.stem.replace('.map', '')
                    reduce_file = item / f"{view_name}_reduce.js"
                    databases[db_name]["design_docs"][design_doc_name]["views"][view_name] = {
                        "reduce": reduce_file.exists()
                    }
            elif item.is_dir() and item.name == "_design":
                for design_doc_path in sorted(item.iterdir()):
                    if design_doc_path.is_dir():
                        design_doc_name = design_doc_path.name
                        databases[db_name]["design_docs"][design_doc_name] = {"views": {}}
                        for view_file in sorted(design_doc_path.glob("*.map.js")):
                            view_name = view_file.stem.replace(".map", "")
                            reduce_file = design_doc_path / f"{view_name}.reduce.js"
                            databases[db_name]["design_docs"][design_doc_name]["views"][view_name] = {
                                "reduce": reduce_file.exists()
                            }
    return {"databases": databases}

def load_config(config_path):
    """Load the existing config file."""
    if not config_path.exists():
        return {"databases": {}}
    with open(config_path, "r") as f:
        return yaml.safe_load(f) or {"databases": {}}

def save_config(config, config_path):
    """Save the config to file."""
    with open(config_path, "w") as f:
        yaml.dump(config, f, default_flow_style=False, sort_keys=False)

def compare_and_report(scanned_config, loaded_config):
    """Compare scanned and loaded configs, report differences."""
    scanned_dbs = scanned_config.get("databases", {})
    loaded_dbs = loaded_config.get("databases", {})
    all_ok = True

    for db_name in scanned_dbs:
        if db_name not in loaded_dbs:
            print(f"❌ Database '{db_name}' is in directory but missing from config")
            all_ok = False
            continue
        for doc_name in scanned_dbs[db_name].get("design_docs", {}):
            if doc_name not in loaded_dbs[db_name].get("design_docs", {}):
                print(f"❌ Design doc '{doc_name}' in '{db_name}' is in directory but missing from config")
                all_ok = False
                continue
            for view_name, view_config in scanned_dbs[db_name]["design_docs"][doc_name].get("views", {}).items():
                if view_name not in loaded_dbs[db_name]["design_docs"][doc_name].get("views", {}):
                    print(f"❌ View '{view_name}' in '{db_name}/{doc_name}' is in directory but missing from config")
                    all_ok = False
                elif view_config.get("reduce") != loaded_dbs[db_name]["design_docs"][doc_name]["views"][view_name].get("reduce"):
                    print(f"⚠️  Reduce flag mismatch for '{view_name}' in '{db_name}/{doc_name}'")

    for db_name in loaded_dbs:
        if db_name not in scanned_dbs:
            print(f"⚠️  Database '{db_name}' is in config but missing from directory")
            all_ok = False
            continue
        for doc_name in loaded_dbs[db_name].get("design_docs", {}):
            if doc_name not in scanned_dbs[db_name].get("design_docs", {}):
                print(f"⚠️  Design doc '{doc_name}' in '{db_name}' is in config but missing from directory")
                all_ok = False
                continue
            for view_name in loaded_dbs[db_name]["design_docs"][doc_name].get("views", {}):
                if view_name not in scanned_dbs[db_name]["design_docs"][doc_name].get("views", {}):
                    print(f"⚠️  View '{view_name}' in '{db_name}/{doc_name}' is in config but missing from directory")
                    all_ok = False

    if all_ok:
        print("✅ Config is up to date with directory structure")
    return all_ok

def update_config(scanned_config, loaded_config):
    """Update the loaded config to match the scanned structure, preserving dev flags."""
    updated_config = {"databases": {}}
    for db_name, db_data in scanned_config.get("databases", {}).items():
        updated_config["databases"][db_name] = {"design_docs": {}}
        for doc_name, doc_data in db_data.get("design_docs", {}).items():
            updated_config["databases"][db_name]["design_docs"][doc_name] = {"views": {}}
            for view_name, view_config in doc_data.get("views", {}).items():
                dev_flag = loaded_config.get("databases", {}).get(db_name, {}).get("design_docs", {}).get(doc_name, {}).get("views", {}).get(view_name, {}).get("dev", False)
                updated_config["databases"][db_name]["design_docs"][doc_name]["views"][view_name] = {
                    "reduce": view_config["reduce"],
                    "dev": dev_flag
                }
    return updated_config

def main():
    parser = argparse.ArgumentParser(description="Check or update CouchDB views config based on directory structure.")
    parser.add_argument("--config", default="config.yaml", help="Path to config file")
    parser.add_argument("--views-dir", default="views", help="Path to views directory")
    parser.add_argument("--check", action="store_true", help="Check if config is up to date")
    parser.add_argument("--update", action="store_true", help="Update config to match directory structure")
    args = parser.parse_args()

    views_dir = Path(args.views_dir)
    config_path = Path(args.config)
    scanned_config = scan_views_directory(views_dir)
    loaded_config = load_config(config_path)

    if args.update:
        updated_config = update_config(scanned_config, loaded_config)
        save_config(updated_config, config_path)
        print(f"✅ Config updated to match directory structure. File saved to {config_path}")
        compare_and_report(scanned_config, loaded_config)
    else:
        compare_and_report(scanned_config, loaded_config)

if __name__ == "__main__":
    main()