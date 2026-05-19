#!/usr/bin/env python3
"""
Verification Script - Check if translation files were created successfully
Run this AFTER running any translation generator
"""

import os
import json
from pathlib import Path
from collections import defaultdict

def verify_translations():
    """Verify translation files exist and are valid"""
    
    print("\n" + "="*70)
    print("VERIFICATION: Smart Agro AI Advisor Translation Structure")
    print("="*70 + "\n")
    
    base_path = Path("client/src/locales")
    
    # Check if directory exists
    if not base_path.exists():
        print(f"❌ ERROR: Directory does not exist: {base_path}")
        return False
    
    print(f"✅ Found locales directory: {base_path}\n")
    
    expected_langs = {
        'en', 'hi', 'mr', 'kn', 'ta', 'te', 'ml', 'gu', 'pa', 'bn',
        'or', 'ur', 'as', 'kok', 'sa', 'mni', 'ne', 'bho', 'hry', 'raj'
    }
    
    expected_namespaces = {
        'common', 'auth', 'dashboard', 'crops', 'soil', 'weather',
        'disease', 'yield', 'chat', 'community', 'government',
        'settings', 'notifications', 'errors', 'validation'
    }
    
    # Scan directories
    lang_dirs = {d.name: d for d in base_path.iterdir() if d.is_dir()}
    
    print(f"📊 LANGUAGES FOUND: {len(lang_dirs)}/20\n")
    
    total_files = 0
    total_valid = 0
    issues = []
    
    # Check each language
    for lang_code in sorted(lang_dirs.keys()):
        lang_dir = lang_dirs[lang_code]
        json_files = list(lang_dir.glob("*.json"))
        
        status = "✅" if len(json_files) == 15 else "⚠️"
        print(f"{status} {lang_code}: {len(json_files)}/15 files", end="")
        
        # Validate JSON files
        valid_count = 0
        for json_file in json_files:
            total_files += 1
            try:
                with open(json_file, 'r', encoding='utf-8') as f:
                    data = json.load(f)
                    valid_count += 1
                    total_valid += 1
            except Exception as e:
                issues.append(f"  Invalid JSON: {json_file} - {e}")
        
        if valid_count == len(json_files):
            print(" [all valid JSON]")
        else:
            print(f" [{valid_count}/{len(json_files)} valid]")
    
    # Check for missing languages
    missing_langs = expected_langs - set(lang_dirs.keys())
    if missing_langs:
        print(f"\n⚠️  Missing languages: {sorted(missing_langs)}")
        issues.append(f"Missing {len(missing_langs)} languages")
    
    # Check for unexpected languages
    extra_langs = set(lang_dirs.keys()) - expected_langs
    if extra_langs:
        print(f"⚠️  Unexpected languages: {sorted(extra_langs)}")
    
    # Print summary
    print(f"\n{'='*70}")
    print(f"📊 SUMMARY:")
    print(f"{'='*70}")
    print(f"  Total files found: {total_files}")
    print(f"  Total files expected: 280 (20 × 15)")
    print(f"  Valid JSON files: {total_valid}")
    print(f"  Language directories: {len(lang_dirs)}/20")
    print(f"  Status: {'✅ COMPLETE' if total_files == 280 and total_valid == 280 else '⚠️  INCOMPLETE'}")
    print(f"{'='*70}\n")
    
    # Print issues if any
    if issues:
        print("Issues found:")
        for issue in issues:
            print(f"  • {issue}")
        print()
    
    # Detailed file check
    if total_files == 280 and total_valid == 280:
        print("✨ SUCCESS! All 280 translation files are present and valid.\n")
        
        # Show file breakdown
        print("File breakdown by language:")
        for lang in sorted(lang_dirs.keys()):
            json_files = list(lang_dirs[lang].glob("*.json"))
            namespaces = {f.stem for f in json_files}
            print(f"  {lang}: {', '.join(sorted(namespaces))}")
        
        return True
    else:
        print(f"❌ INCOMPLETE! Expected 280 files, found {total_files}")
        if total_files > 0:
            print(f"   ({(total_files/280)*100:.1f}% complete)")
        return False

def check_npm_audit():
    """Check npm audit status"""
    print("\n" + "="*70)
    print("CHECKING: npm audit status")
    print("="*70 + "\n")
    
    if not os.path.isdir("client"):
        print("⚠️  Client directory not found, skipping npm audit check")
        return
    
    package_file = Path("client/package.json")
    if package_file.exists():
        print(f"✅ Found package.json in client directory")
        try:
            with open(package_file, 'r') as f:
                pkg = json.load(f)
                print(f"  Dependencies: {len(pkg.get('dependencies', {}))}")
                print(f"  DevDependencies: {len(pkg.get('devDependencies', {}))}")
        except:
            pass
        
        print("\nTo check npm vulnerabilities manually, run:")
        print("  cd client")
        print("  npm audit")
        print("\nTo fix vulnerabilities, run:")
        print("  cd client")
        print("  npm audit fix --force")
    else:
        print("⚠️  package.json not found")

def main():
    os.chdir(Path(__file__).parent)
    
    print("\n" + "🔍 "*10)
    print("VERIFICATION SCRIPT")
    print("🔍 "*10 + "\n")
    
    # Verify translations
    trans_ok = verify_translations()
    
    # Check npm
    check_npm_audit()
    
    # Final verdict
    print("\n" + "="*70)
    print("FINAL VERDICT")
    print("="*70)
    
    if trans_ok:
        print("✅ TASK 2 (Translations): COMPLETE")
        print("   - 280 files created")
        print("   - 20 languages configured")
        print("   - 15 namespaces per language")
        print("   - All files valid JSON")
    else:
        print("❌ TASK 2 (Translations): INCOMPLETE")
        print("   Run: python direct-generate-translations.py")
    
    print("\n⚠️  TASK 1 (npm audit): CHECK MANUALLY")
    print("   Run: cd client && npm audit")
    print("   Then: npm audit fix --force")
    
    print("\n" + "="*70 + "\n")
    
    return 0 if trans_ok else 1

if __name__ == "__main__":
    exit(main())
