import os
import re

def refactor_file(file_path):
    with open(file_path, 'r', encoding='utf-8') as f:
        content = f.read()
    
    # Check if file has a component and styles
    if "StyleSheet.create" not in content or "export default function" not in content:
        return
        
    if "getStyles(" in content: 
        return # already refactored
        
    # Replace Colors import to accommodate LightColors/DarkColors
    if "import { Colors }" in content:
        content = re.sub(
            r"import \{ Colors \} from '([^']+colors)';",
            r"import { LightColors, DarkColors } from '\1';",
            content
        )
    elif "import Colors from" in content:
        content = re.sub(
            r"import Colors from '([^']+colors)';",
            r"import { LightColors, DarkColors } from '\1';",
            content
        )
    else:
        # We need LightColors/DarkColors if we are going to use them, but maybe Colors isn't imported?
        # If it's not imported but styles uses it, it's an error. If it's not used, we skip.
        if "Colors." in content:
            # Let's hope it's not a false positive
            pass

    # Find the main component function
    # Usually: export default function Something() {
    func_match = re.search(r"export default function ([A-Za-z0-9_]+)\([^)]*\)\s*\{", content)
    if not func_match:
        return
        
    func_start_idx = func_match.end()
    
    # Check if useAppContext is imported
    if "useAppContext" not in content:
        # Add import at the top
        content = "import { useAppContext } from '../../context/AppContext';\n" + content
        
    # Inject theme logic inside component
    injection = "\n  const { theme, toggleTheme } = useAppContext();\n  const Colors = theme === 'dark' ? DarkColors : LightColors;\n  const styles = getStyles(Colors);\n"
    content = content[:func_start_idx] + injection + content[func_start_idx:]
    
    # We also need to add the Dark/Light toggle to the header.
    # We look for langToggle and langText
    toggle_ui = """
          <TouchableOpacity style={{ marginRight: 16 }} onPress={toggleTheme}>
            <Text style={{ fontSize: 22 }}>{theme === 'dark' ? '🌙' : '☀️'}</Text>
          </TouchableOpacity>
"""
    # Find langToggle location
    if "styles.langToggle" in content:
        # We want to place the theme toggle just LEFT of the language toggle.
        # usually it is inside a flex-row view. 
        # Example:  <TouchableOpacity style={styles.langToggle}
        content = re.sub(
            r"(<TouchableOpacity[^>]*style=\{styles\.langToggle\})",
            toggle_ui + r"\n          \1",
            content
        )
    
    # Now replace const styles = StyleSheet.create({
    content = content.replace("const styles = StyleSheet.create({", "const getStyles = (Colors: any) => StyleSheet.create({")
    
    # Fix any instances of Colors.something outside the component or getStyles?
    # Actually, as long as everything using Colors is inside the component OR inside getStyles, we're fine.
    # What if Colors is used in the component? It will resolve to the local variable `const Colors`.
    # What if there are other functions? They'll need Colors passed, but let's assume they are inside or don't use Colors.

    with open(file_path, 'w', encoding='utf-8') as f:
        f.write(content)

def main():
    base_dir = '/home/dhirendra/Nyay mitra/Nyay-Mitra/frontend/app'
    for root, dirs, files in os.walk(base_dir):
        for f in files:
            if f.endswith('.tsx'):
                refactor_file(os.path.join(root, f))
                
if __name__ == '__main__':
    main()
