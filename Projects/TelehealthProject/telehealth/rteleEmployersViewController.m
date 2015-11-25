//
//  rteleEmployersViewController.m
//  telehealth
//
//  Created by Khoa Nguyen on 26/09/12.
//  Copyright (c) 2012 REDiMED. All rights reserved.
//

#import "rteleEmployersViewController.h"
#import "rteleAppDelegate.h"
#import "rteleEmployers.h"
#import "rteleSettingsViewController.h"
#import "rteleDoctors.h"
#import "constants.h"
#import "MBProgressHUD.h"

@interface rteleEmployersViewController ()

@end

@implementation rteleEmployersViewController
@synthesize entries;
@synthesize searchBar;
@synthesize selectedIndex;
@synthesize tableview;
@synthesize filteredEntries = filteredEntries;
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
    [super viewDidLoad];

    // Uncomment the following line to preserve selection between presentations.
    // self.clearsSelectionOnViewWillAppear = NO;
 
    // Uncomment the following line to display an Edit button in the navigation bar for this view controller.
    // self.navigationItem.rightBarButtonItem = self.editButtonItem;
    [self.navigationItem setBackBarButtonItem:[[UIBarButtonItem alloc] initWithTitle:@"Back" style:UIBarButtonItemStylePlain target:nil action:nil]];
    UIBarButtonItem *homeBtn = [[UIBarButtonItem alloc] initWithTitle:@"Home" style:UIBarButtonItemStylePlain target:self action:@selector(goBackHome)];
    // function buttonr
    UIBarButtonItem *functionBtn = [[UIBarButtonItem alloc] initWithTitle:@"Add Company" style:UIBarButtonItemStylePlain target:self action:@selector(addCompany)];
    self.navigationItem.rightBarButtonItems = [NSArray arrayWithObjects:homeBtn, functionBtn, nil];
    
    searchBar.delegate = (id)self;
    rteleAppDelegate	* delegate = [[UIApplication sharedApplication] delegate];
    [delegate hideActivityViewer];
    
    [tableview setTableFooterView:[[UIView alloc] initWithFrame:CGRectZero]];
}
-(void)viewWillAppear:(BOOL)animated{
    [super viewWillAppear:animated];
    
    if (entries.count  <= 0) {
        [MBProgressHUD showHUDAddedTo:self.view animated:YES];
        dispatch_time_t popTime = dispatch_time(DISPATCH_TIME_NOW, 0.01 * NSEC_PER_SEC);
        dispatch_after(popTime, dispatch_get_main_queue(), ^(void){
            //Get doctor ID
            entries = [[[rteleEmployers alloc] init] loadData];
            
            //        dispatch_async(dispatch_get_main_queue(), ^{
            [tableview reloadData];
            //        });
            
            // Do something...
            [MBProgressHUD hideHUDForView:self.view animated:YES];
        });
    }

}
-(void)addCompany{
    [self performSegueWithIdentifier:@"addEmployer" sender:nil];
}
- (void)didReceiveMemoryWarning
{
    [super didReceiveMemoryWarning];
    // Dispose of any resources that can be recreated.
}
-(void)goBackHome{
    [self.navigationController popToRootViewControllerAnimated:YES];
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
        
        for (rteleEmployer* entry in entries)
        {
            NSString *name = [NSString stringWithFormat:@"%@",entry.name];
            NSRange nameRange = [name rangeOfString:text options:NSCaseInsensitiveSearch];
            if(nameRange.location != NSNotFound)
            {
                [filteredEntries addObject:entry];
            }
        }
    }
    
    [self.tableView reloadData];
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
    int rowCount;
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
    rteleEmployer *entry;
    if(isFiltered)
        entry = [filteredEntries objectAtIndex:indexPath.row];
    else
        entry = [entries objectAtIndex:indexPath.row];
    
    //rteleEmployer *entry = [entries objectAtIndex:indexPath.row];
    NSString *name = [NSString stringWithFormat:@"%@",entry.name];
    if (name && ![name isEqualToString:@"0"]) {
        cell.textLabel.text = entry.name;
    }
    if (entry.address) {
        cell.detailTextLabel.text = entry.address;
    }
    
    return cell;
    
}
/*
 
 - (void)tableView:(UITableView *)tableView accessoryButtonTappedForRowWithIndexPath:(NSIndexPath *)indexPath
 {
 [tableView deselectRowAtIndexPath:indexPath animated:YES];
 rteleEmployer* selectedEntry;
 
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

-(void)tableView:(UITableView *)tableView didSelectRowAtIndexPath:(NSIndexPath *)indexPath
{
    [tableView deselectRowAtIndexPath:indexPath animated:YES];
    rteleEmployer* selectedEntry;
    
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
     //NSLog(@"%@ - %d",selectedEntry.eid,[selectedEntry.eid integerValue]);
     [sheet showInView:self.view];*/
    
    selectedIndex = indexPath;
    
    rteleAppDelegate	* delegate = [[UIApplication sharedApplication] delegate];
    [delegate showActivityViewer:self withFrame:CGRectMake(tableView.contentOffset.x,tableView.contentOffset.y,tableView.contentSize.width,tableView.contentSize.height)];
    [self performSelector:@selector(showDetailsForIndexPath:) withObject:[NSString stringWithFormat:@"%d",[selectedEntry.eid integerValue]] afterDelay:0.5];
    //Function gets called when user taps on a button
    
    //[self performSelector:@selector(showDetailsForIndexPath:) withObject:indexPath afterDelay:0.5];
}
- (void)prepareForSegue:(UIStoryboardSegue *)segue sender:(id)sender {
    if ([segue.identifier isEqualToString:@"editEmployer"]) {
        //NSIndexPath *indexPath = [self.tableView indexPathForSelectedRow];
        rteleSettingsViewController *vc = segue.destinationViewController;
        rteleEmployer* selectedEntry;
        
        if(isFiltered)
        {
            selectedEntry = [filteredEntries objectAtIndex:selectedIndex.row];
        }
        else
        {
            selectedEntry = [entries objectAtIndex:selectedIndex.row];
        }
        //vc.selectedIndex = selectedIndex;
        vc.employer = selectedEntry;
        rteleAppDelegate	* delegate = [[UIApplication sharedApplication] delegate];
        [delegate hideActivityViewer];
        //NSLog(@"%d", type);
    }
}
-(void) showDetailsForIndexPath:(NSString*)eid
{
    
    [self.searchBar resignFirstResponder];
    [self performSegueWithIdentifier:@"editEmployer" sender:nil];
    
}


 // Override to support conditional editing of the table view.
 - (BOOL)tableView:(UITableView *)tableView canEditRowAtIndexPath:(NSIndexPath *)indexPath
 {
 // Return NO if you do not want the specified item to be editable.
 return YES;
 }




- (void)tableView:(UITableView *)tableView commitEditingStyle:(UITableViewCellEditingStyle)editingStyle forRowAtIndexPath:(NSIndexPath *)indexPath
{
	if (editingStyle == UITableViewCellEditingStyleDelete)
	{
		rteleEmployer *eentry;
        if(isFiltered){
            eentry = [filteredEntries objectAtIndex:indexPath.row];
            [filteredEntries removeObjectAtIndex:indexPath.row];
        }else{
            eentry = [entries objectAtIndex:indexPath.row];
            [entries removeObjectAtIndex:indexPath.row];
        }
		rteleDoctor *member = [[[rteleDoctors alloc] init] loadDataWithCompanyId:eentry.eid];
        NSUserDefaults *defaults = [NSUserDefaults standardUserDefaults];
        NSString *retval = [rteleWebserviceManager sendSynchronousWebserviceRequest:[NSString stringWithFormat:@"json/employerDelete/%@/%@/?token=%@", eentry.eid, member.mid,[defaults valueForKey:@"tokenUser"]] showAlert:YES];
        
        rteleAppDelegate	* delegate = [[UIApplication sharedApplication] delegate];
        [delegate hideActivityViewer];
        
        if ([retval isEqualToString:@"1"]){
            [tableView deleteRowsAtIndexPaths:[NSArray arrayWithObject:indexPath] withRowAnimation:UITableViewRowAnimationFade];
        }
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
