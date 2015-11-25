//
//  rteleResultsViewController.m
//  telehealth
//
//  Created by Khoa Nguyen on 28/08/12.
//  Copyright (c) 2012 REDiMED. All rights reserved.
//

#import "rteleResultsViewController.h"
#import "rteleEntries.h"
#import "rteleEmployees.h"
#import "rteleAppDelegate.h"
#import "rteleSplitViewController.h"
#import "constants.h"
#import "rteleFormS1Controller.h"
#import "MBProgressHUD.h"

@interface rteleResultsViewController (){
    BOOL isLoad;
    
    BOOL isLoadAll;
    NSInteger currentIndexLoaded;
}

@end

@implementation rteleResultsViewController
@synthesize entries;
@synthesize searchBar;
@synthesize selectedIndex;
@synthesize  filteredEntries = filteredEntries;
@synthesize isFiltered = isFiltered;


- (id)initWithStyle:(UITableViewStyle)style
{
    self = [super initWithStyle:style];
    if (self) {
        // Custom initialization
    }
    return self;
}

- (void)viewDidLoad
{
    isLoad = TRUE;
    isLoadAll = FALSE;
    [super viewDidLoad];
    [self.navigationItem setBackBarButtonItem:[[UIBarButtonItem alloc] initWithTitle:@"Back" style:UIBarButtonItemStylePlain target:nil action:nil]];
    UIBarButtonItem *anotherButton = [[UIBarButtonItem alloc] initWithTitle:@"Home" style:UIBarButtonItemStylePlain target:self action:@selector(goBackHome)];
    self.navigationItem.rightBarButtonItem = anotherButton;
}
-(void)viewWillAppear:(BOOL)animated{
    if (isLoad) {
        rteleAppDelegate	* delegate = [[UIApplication sharedApplication] delegate];
        
        entries = [[[rteleEmployees alloc] init] loadData:0];
        
        if (entries.count <= 0) {
            [self.navigationController popViewControllerAnimated:YES];
        }else{
            isLoad = FALSE;
            currentIndexLoaded = 30;
        }
        searchBar.delegate = (id)self;
        // Uncomment the following line to preserve selection between presentations.
        // self.clearsSelectionOnViewWillAppear = NO;
        
        // Uncomment the following line to display an Edit button in the navigation bar for this view controller.
        // self.navigationItem.rightBarButtonItem = self.editButtonItem;
        [delegate hideActivityViewer];
    }
    
}
-(void)goBackHome{
    [self.navigationController popToRootViewControllerAnimated:YES];
}

- (BOOL)searchBarShouldBeginEditing:(UISearchBar *)searchBar{
    
    if (!isLoadAll) {
        
        [MBProgressHUD showHUDAddedTo:self.view animated:YES];
        dispatch_time_t popTime = dispatch_time(DISPATCH_TIME_NOW, 0.01 * NSEC_PER_SEC);
        dispatch_after(popTime, dispatch_get_main_queue(), ^(void){
            
            [entries removeAllObjects];
            entries = nil;
            entries = [[[rteleEmployees alloc] init] loadData:-1];
            currentIndexLoaded = 0;
            if (entries.count > 0) {
                [self.tableView reloadData];
                isLoadAll = YES;
            }
            // Do something...
            [MBProgressHUD hideHUDForView:self.view animated:YES];
        });
        
        
        
        return FALSE;
    }
    return TRUE;
}
-(void)searchBar:(UISearchBar*)searchBar textDidChange:(NSString*)text
{
    //NSLog(@"%@",text);
    if(text.length == 0)
    {
        isFiltered = FALSE;
    }
    else
    {
        isFiltered = TRUE;
        filteredEntries = [[NSMutableArray alloc] init];
        
        for (rteleEmployee* entry in entries)
        {
            NSRange nameRange = [entry.fname rangeOfString:text options:NSCaseInsensitiveSearch];
            NSRange descriptionRange = [entry.gname rangeOfString:text options:NSCaseInsensitiveSearch];
            if(nameRange.location != NSNotFound || descriptionRange.location != NSNotFound)
            {
                [filteredEntries addObject:entry];
            }
        }
    }
    
    [self.tableView reloadData];
}
- (void)searchBarCancelButtonClicked:(UISearchBar *)searchBari
{
    [searchBari resignFirstResponder];
}

- (void)searchBarSearchButtonClicked:(UISearchBar *)searchBari
{
    [searchBari resignFirstResponder];
}
- (void)viewDidUnload
{
    [super viewDidUnload];
    // Release any retained subviews of the main view.
    // e.g. self.myOutlet = nil;
}

- (BOOL)shouldAutorotateToInterfaceOrientation:(UIInterfaceOrientation)interfaceOrientation
{
    if (UIInterfaceOrientationIsLandscape(interfaceOrientation)) {
        return YES;
    }
    return NO;
}

#pragma mark - Table view data source

- (NSInteger)numberOfSectionsInTableView:(UITableView *)tableView
{
    // Return the number of sections.
    return 1;
}

- (NSInteger)tableView:(UITableView *)tableView numberOfRowsInSection:(NSInteger)section
{
    NSInteger rowCount;
    if(isFiltered)
        rowCount = [filteredEntries count];
    else
        rowCount = [entries count];
    
    return rowCount;
}

- (UITableViewCell *)tableView:(UITableView *)tableView cellForRowAtIndexPath:(NSIndexPath *)indexPath
{
    
    UITableViewCell *cell = [tableView
                             dequeueReusableCellWithIdentifier:@"EntryCell"];
    rteleEmployee *entry;
    if(isFiltered)
        entry = [filteredEntries objectAtIndex:indexPath.row];
    else
        entry = [entries objectAtIndex:indexPath.row];
    
    //rteleEmployee *entry = [entries objectAtIndex:indexPath.row];
    cell.textLabel.text = [[entry.gname stringByAppendingString:@" "] stringByAppendingString:entry.fname];
    cell.detailTextLabel.text = entry.dob;
    //NSLog(@"%@-%@", cell.textLabel.text ,entry.dob);
    if ([entry.status intValue]==1)
        [cell.imageView setImage:[UIImage imageNamed:@"new.png"]];
    else
        [cell.imageView setImage:[UIImage imageNamed:@"check.png"]];
    
//    //Addgesture to table view cell

    if ([[UIDevice currentDevice] userInterfaceIdiom] == UIUserInterfaceIdiomPad) {
        UIButton *viewButton = [UIButton buttonWithType:UIButtonTypeCustom];
        [viewButton setTitle:@"View" forState:UIControlStateNormal];
        [viewButton setTitleColor:[UIColor whiteColor] forState:UIControlStateNormal];
        [viewButton setBackgroundColor:[UIColor grayColor]];
        [viewButton setFrame:CGRectMake(0, 4, cell.frame.size.height, cell.frame.size.height - 8)];
        viewButton.layer.borderColor = [[UIColor blackColor] CGColor];
        viewButton.layer.borderWidth = 1.0;
        viewButton.layer.cornerRadius = 5;
        [viewButton addTarget:self action:@selector(viewProfileButtonClicked:) forControlEvents:UIControlEventTouchUpInside];
        [viewButton setTag:indexPath.row];
        [cell setAccessoryView:viewButton];
    }

    //Need load more than
    dispatch_queue_t myQueue = dispatch_queue_create("hungcao.loadData", 0);
    dispatch_async(myQueue, ^{
        if (indexPath.row == currentIndexLoaded - 5) {
            NSLog(@"\nCurrentIdexLoaded: %d",currentIndexLoaded);
            NSMutableArray *arrData = [[[rteleEmployees alloc] init] loadData:currentIndexLoaded];
            if (arrData.count > 0) {
                [entries addObjectsFromArray:arrData];
                currentIndexLoaded+=30;
                [self.tableView reloadData];
                
            }
        }
    });
    
//    //end
    return cell;
    
}

//-(void) handleSwipeGesture:(UISwipeGestureRecognizer *) recognizer{
//    CGPoint location = [recognizer locationInView:self.tableView];
//    NSIndexPath *indexPath = [self.tableView indexPathForRowAtPoint:location];
//    UITableViewCell *cellSelected = [self.tableView cellForRowAtIndexPath:indexPath];
//    
//    if (recognizer.direction == UISwipeGestureRecognizerDirectionRight) {
//        [cellSelected setAccessoryView:nil];
//    }else{
//        //add view button
//        UIButton *viewButton = [UIButton buttonWithType:UIButtonTypeCustom];
//        [viewButton setTitle:@"View" forState:UIControlStateNormal];
//        [viewButton setBackgroundColor:[UIColor grayColor]];
//        [cellSelected setAccessoryView:viewButton];
//    }
//}
/*
 
 - (void)tableView:(UITableView *)tableView accessoryButtonTappedForRowWithIndexPath:(NSIndexPath *)indexPath
 {
 [tableView deselectRowAtIndexPath:indexPath animated:YES];
 rteleEmployee* selectedEntry;
 
 if(isFiltered)
 {
 selectedEntry = [filteredEntries objectAtIndex:indexPath.row];
 }
 else
 {
 selectedEntry = [entries objectAtIndex:indexPath.row];
 }
 
 UIActionSheet *sheet = [[UIActionSheet alloc] initWithTitle:[NSString stringWithFormat:@"Please choose a function for %@.",[[selectedEntry.gname stringByAppendingString:@" "] stringByAppendingString:selectedEntry.fname]]
 delegate:self
 cancelButtonTitle:@"Cancel"
 destructiveButtonTitle:nil
 otherButtonTitles:@"View certificates", @"View detail", @"Delete", nil];
 sheet.actionSheetStyle = UIActionSheetStyleBlackTranslucent;
 [sheet showInView:self.view];
 //[self performSelector:@selector(showDetailsForIndexPath:) withObject:indexPath afterDelay:0.5];
 }
 */

-(void) viewProfileButtonClicked:(UIButton *) button{
    NSLog(@"\n %s \n",__func__);
    
    [MBProgressHUD showHUDAddedTo:self.view animated:YES];
    dispatch_time_t popTime = dispatch_time(DISPATCH_TIME_NOW, 0.01 * NSEC_PER_SEC);
    dispatch_after(popTime, dispatch_get_main_queue(), ^(void){
        rteleEmployee *employee = nil;
        if (isFiltered) {
            employee = [filteredEntries objectAtIndex:button.tag];
        }else{
            employee = [entries objectAtIndex:button.tag];
        }
        
        rteleEntry *entry = [[[rteleEntries alloc] init] loadDataWithId:employee.entryID];
        NSLog(@"%@",entry.detail);
        
        UIStoryboard *mainStoryboard = [UIStoryboard storyboardWithName:@"MainStoryboard"
                                                                 bundle: nil];
        
        rteleFormS1Controller *formController = [mainStoryboard instantiateViewControllerWithIdentifier:@"rteleFormS1UpdateController"];
        [formController dataForView:entry.detail entryID:employee.entryID];
        [self.navigationController pushViewController:formController animated:YES];
        
        // Do something...
        [MBProgressHUD hideHUDForView:self.view animated:YES];
    });
}
-(void)tableView:(UITableView *)tableView didSelectRowAtIndexPath:(NSIndexPath *)indexPath
{
    [tableView deselectRowAtIndexPath:indexPath animated:YES];
    rteleEmployee* selectedEntry;
    
    if(isFiltered)
    {
        selectedEntry = [filteredEntries objectAtIndex:indexPath.row];
    }
    else
    {
        selectedEntry = [entries objectAtIndex:indexPath.row];
    }
    
    /*UIActionSheet *sheet = [[UIActionSheet alloc] initWithTitle:[NSString stringWithFormat:@"Please choose a function for %@.",[[selectedEntry.gname stringByAppendingString:@" "] stringByAppendingString:selectedEntry.fname]]
     delegate:self
     cancelButtonTitle:@"Cancel"
     destructiveButtonTitle:nil
     otherButtonTitles:@"View certificates", @"View detail", @"Delete", nil];
     sheet.actionSheetStyle = UIActionSheetStyleBlackTranslucent;
     sheet.tag = [selectedEntry.eid integerValue];
     NSLog(@"%@ - %d",selectedEntry.eid,[selectedEntry.eid integerValue]);
     [sheet showInView:self.view];*/
    //NSLog(@"%@ - %d",selectedEntry.eid,[selectedEntry.eid integerValue]);
    selectedIndex = indexPath;
    
    rteleAppDelegate	* delegate = [[UIApplication sharedApplication] delegate];
    [delegate showActivityViewer:self withFrame:CGRectMake(tableView.contentOffset.x,tableView.contentOffset.y,tableView.contentSize.width,tableView.contentSize.height)];
    [self performSelector:@selector(showDetailsForIndexPath:) withObject:[NSString stringWithFormat:@"%d",[selectedEntry.eid integerValue]] afterDelay:0.5];
    //Function gets called when user taps on a button
        
    //[self performSelector:@selector(showDetailsForIndexPath:) withObject:indexPath afterDelay:0.5];
}
- (void)prepareForSegue:(UIStoryboardSegue *)segue sender:(id)sender {
    if ([segue.identifier isEqualToString:@"splitsegue"]) {
        [[NSUserDefaults standardUserDefaults] setValue:@"1" forKey:@"loadagain"];
        //NSIndexPath *indexPath = [self.tableView indexPathForSelectedRow];
        rteleSplitViewController *vc = segue.destinationViewController;
        rteleEmployee* selectedEntry = nil;
        
        if(isFiltered)
        {
            selectedEntry = [filteredEntries objectAtIndex:selectedIndex.row];
        }
        else
        {
            selectedEntry = [entries objectAtIndex:selectedIndex.row];
        }
        //vc.selectedIndex = selectedIndex;
        vc.employeeId = selectedEntry.eid;
        rteleAppDelegate	* delegate = [[UIApplication sharedApplication] delegate];
        [delegate hideActivityViewer];
        //NSLog(@"%d", type);
    }
    
    if ([segue.identifier isEqualToString:@"detailForiPhone"]) {
        //iPhone
        
        rteleAppDelegate	* delegate = [[UIApplication sharedApplication] delegate];
        [delegate hideActivityViewer];
    }
}
-(void) showDetailsForIndexPath:(NSString*)eid
{
    
    [self.searchBar resignFirstResponder];
    if ([[UIDevice currentDevice] userInterfaceIdiom] == UIUserInterfaceIdiomPad) {
        [self performSegueWithIdentifier:@"splitsegue" sender:nil];
    }else{
        //action for iPhone
        [self performSegueWithIdentifier:@"splitsegue" sender:nil];
    }
    
    
//    UIStoryboard *storyboard = [UIApplication sharedApplication].delegate.window.rootViewController.storyboard;
//    
//    rteleSplitViewController *loginController = [storyboard instantiateViewControllerWithIdentifier:@"splitView"];
//    rteleEmployee* selectedEntry;
//    
//    if(isFiltered)
//    {
//        selectedEntry = [filteredEntries objectAtIndex:selectedIndex.row];
//    }
//    else
//    {
//        selectedEntry = [entries objectAtIndex:selectedIndex.row];
//    }
//    //vc.selectedIndex = selectedIndex;
//    loginController.employeeId = selectedEntry.eid;
//    rteleAppDelegate	* delegate = [[UIApplication sharedApplication] delegate];
//    [delegate hideActivityViewer];
//    [self.navigationController pushViewController:loginController animated:YES];
}

//RootViewController.m
- (NSString *)tableView:(UITableView *)tableView titleForHeaderInSection:(NSInteger)section {
    
    if(section == 0)
        return @"Pending patients";
    else
        return @"Assessed patients";
}

- (BOOL)tableView:(UITableView *)tableView canEditRowAtIndexPath:(NSIndexPath *)indexPath
{
    // Return NO if you do not want the specified item to be editable.
    /*rteleEntry *eentry;
     if(isFiltered)
     eentry = [filteredEntries objectAtIndex:indexPath.row];
     else
     eentry = [entries objectAtIndex:indexPath.row];*/
    
    //rteleEntry *entry = [entries objectAtIndex:indexPath.row];
    NSUserDefaults* defaults = [NSUserDefaults standardUserDefaults];
    if ([[defaults objectForKey:@"type"] isEqualToString:@"0"]){
        return NO;
    }else{
        return YES;
    }
    
}



- (void)tableView:(UITableView *)tableView commitEditingStyle:(UITableViewCellEditingStyle)editingStyle forRowAtIndexPath:(NSIndexPath *)indexPath
{
    if (editingStyle == UITableViewCellEditingStyleDelete)
    {
        
        rteleEntry *eentry = nil;
        if(isFiltered){
            eentry = [filteredEntries objectAtIndex:indexPath.row];
            [filteredEntries removeObjectAtIndex:indexPath.row];
        }else{
            eentry = [entries objectAtIndex:indexPath.row];
            [entries removeObjectAtIndex:indexPath.row];
        }
        
        
        [tableView deleteRowsAtIndexPaths:[NSArray arrayWithObject:indexPath] withRowAnimation:UITableViewRowAnimationFade];
        NSUserDefaults *defaults = [NSUserDefaults standardUserDefaults];
        [rteleWebserviceManager sendSynchronousWebserviceRequest:[NSString stringWithFormat:@"json/employeeDelete/%@/?token=%@", eentry.eid,[defaults valueForKey:@"tokenUser"]]];
        
        rteleAppDelegate	* delegate = [[UIApplication sharedApplication] delegate];
        [delegate hideActivityViewer];
    }
    
}

- (NSIndexPath *)tableView:(UITableView *)tableView willSelectRowAtIndexPath:(NSIndexPath *)indexPath
{
    //rteleAppDelegate	* delegate = [[UIApplication sharedApplication] delegate];
    //[delegate showActivityViewer:self];
    return indexPath;
    
}
/*
 // Override to support rearranging the table view.
 - (void)tableView:(UITableView *)tableView moveRowAtIndexPath:(NSIndexPath *)fromIndexPath toIndexPath:(NSIndexPath *)toIndexPath
 {
 }
 */


@end
